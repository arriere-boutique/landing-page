
const moment = require('moment')
const Entities = require('../entities')
const { $fetch } = require('ohmyfetch/node')

exports.syncShop = async function (id, syncItems = [], firstSync = false) {
    return new Promise(async (resolve, reject) => {
        try {
            const shop = await Entities.shop.model.findById(id)

            if (!shop.etsyRefreshed || moment(shop.etsyRefreshed).isBefore(moment())) {
                let refresh = await refreshToken(shop)

                shop.etsyToken = refresh.access_token
                shop.etsyRefreshed = moment().add(refresh.expires_in - 600, 's')
                shop.etsyRefreshToken = refresh.refresh_token
                shop.save()
            }
        
            if (syncItems.includes('info')) {
                if (!shop.lastShopFetch || moment().diff(shop.lastShopFetch, 'minutes') > 5) {
                    shop.lastShopFetch = new Date()

                    try {
                        const shopData = await $fetch(`https://openapi.etsy.com/v3/application/users/${shop.etsyId}/shops`, { headers: {
                            'x-api-key': process.env.ETSY,
                            Authorization: `Bearer ${shop.etsyToken}`,
                        } })
    
                        if (!shop.slug) {
                            let original = shopData.shop_name.toLowerCase()
                            let slug = null
                            let offset = 0
    
                            while (!slug) {
                                let newSlug = offset == 0 ? original : original + offset.toString()
    
                                let existing = await Entities.shop.model.find({ slug: newSlug, _id: { $ne: shop._id } })
    
                                if (existing.length == 0) {
                                    slug = newSlug
                                }
                                
                                offset += 1
                            }
    
                            shop.slug = slug
                        }
    
                        shop.name = shopData.shop_name
                        shop.link = shopData.url
                        shop.logo = shopData.icon_url_fullxfull
                        shop.id = shopData.shop_id
                        shop.openingDate = shopData.create_date
    
                        shop.save()
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
            
            if (firstSync) {
                try {
                    await Entities.landing.model.create({
                        isHome: true,
                        logo: shop.logo,
                        slug: 'home',
                        title: `Bienvenue chez ${shop.name} !`,
                        link: `https://${shop.slug}.${process.env.BASE_DOMAIN}`,
                        customization: {
                            'background': {
                                src: 'https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg'
                            },
                            'background-color': '#000000',
                            'background-opacity': '30',
                            'background-thumbnail': 'https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
                        },
                        modules: [
                            { id: Math.random(), type: 'title-block', position: 0, active: true, title: `Bienvenue chez ${shop.name} !`},
                            { id: Math.random(), type: 'link-list', position: 1, active: true, links: [
                                { id: Math.random(), label: 'Ma boutique Etsy', href: shop.link, active: true }
                            ] }
                        ],
                        shop: shop._id,
                        owner: shop.owner
                    })
                } catch (e) {
                    console.warn('Landing creation failed')
                    console.error(e)
                }
            }

            if (syncItems.includes('listings')) {
                // if (!shop.lastListingFetch || moment().diff(shop.lastListingFetch, 'minutes') > 5) {
                    shop.lastListingFetch = new Date()

                    let listings = await syncListings(shop, syncItems.includes('listing-photos'))
                    shop.listings = listings
                    shop.save()
                // }
            }

            if (syncItems.includes('reviews')) {
                if (!shop.lastReviewFetch || moment().diff(shop.lastReviewFetch, 'minutes') > 5) {
                   shop.lastReviewFetch = new Date()

                    let reviews = await syncReviews(shop)
                    shop.reviews = reviews
                    shop.save()
                }
            }

            if (syncItems.includes('orders')) {
                if (!shop.lastOrderFetch || moment().diff(shop.lastOrderFetch, 'minutes') > 2) {
                    shop.lastOrderFetch = new Date()

                    let orders = await syncOrders(shop)
                    shop.orders = orders
                    shop.save()
                }
            }

            resolve(shop)
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

const refreshToken = async function (shop) {
    return new Promise(async (resolve, reject) => {
        try {
            const refresh = await $fetch(`https://api.etsy.com/v3/public/oauth/token`, {
                method: 'POST',
                body: {
                    "grant_type": "refresh_token",
                    "client_id": process.env.ETSY,
                    "refresh_token": shop.etsyRefreshToken
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            resolve(refresh)
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

const cleanString = function (string) {
    return string ? string.replaceAll('&#39;', `'`).replaceAll('&quot;', `"`).replaceAll('\n', `<br>`) : ''
}

const syncOrders = async function (shop) {
    return new Promise(async (resolve, reject) => {
        try {
            let ordersData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shop.id}/receipts?limit=100&language=fr`, { headers: {
                'x-api-key': process.env.ETSY,
                Authorization: `Bearer ${shop.etsyToken}`,
            }})

            ordersData = await Promise.all(ordersData.results.map(async order => {
                let listings = []
                 
                // if (order.receipt_id == '2376234478') console.log(order)

                listings = await Promise.all(order.transactions.map(async listing => {
                    let existing = await Entities.shopListing.model.findOne({ shop: shop._id, id: listing.listing_id })

                    return {
                        listingId: existing ? existing._id : null,
                        title: cleanString(listing.title),
                        price: listing.price,
                        digital: listing.is_digital,
                        quantity: listing.quantity,
                        sku: listing.sku,
                        variations: listing.variations.map(v => ({
                            id: v.property_id,
                            valueId: v.value_id,
                            label: cleanString(v.formatted_name),
                            value: cleanString(v.formatted_value)
                        })),
                        shipping_cost: listing.shipping_cost
                    }
                }))

                let transaction = order.transactions[0] ? order.transactions[0] : null
                let countryCodes = new Intl.DisplayNames(['fr'], { type: 'region' })

                return {
                    id: order.receipt_id,
                    listings,
                    userId: order.buyer_user_id,
                    email: order.buyer_email,
                    name: order.name,
                    orderDate: order.create_timestamp,
                    adress1: cleanString(order.first_line),
                    adress2: cleanString(order.second_line),
                    zip: order.zip,
                    city: cleanString(order.city),
                    state: order.state,
                    country: countryCodes.of(order.country_iso),
                    status: order.status,
                    isGift: order.is_gift,
                    subTotal: order.subtotal,
                    shipments: order.shipments,
                    transactionId: transaction ? transaction.transaction_id : undefined,
                    shipUpgrade: transaction ? transaction.shipping_upgrade : undefined,
                    shippedDate: transaction ? transaction.shipped_timestamp : undefined,
                    expectedDate: transaction ? transaction.expected_ship_date : undefined,
                    message: cleanString(order.message_from_buyer),
                    totalDiscount: order.discount_amt,
                    totalGiftWrap: order.gift_wrap_price,
                    totalPrice: order.total_price,
                    totalShipping: order.total_shipping_cost,
                    total: order.grandtotal,
                    giftMessage: cleanString(order.gift_message)
                }
            }))

            let orderIds = ordersData.map(i => i.id)
            let ordersToUpdate = await Entities.shopOrder.model.find({ shop: shop._id, id: { $in: orderIds } })

            await Promise.all(ordersToUpdate.map(async order => {
                let corresponding = ordersData.find(o => o.id == order.id)
                let data = await Entities.shopOrder.model.findByIdAndUpdate(order._id, corresponding)

                data.review = await Entities.shopReview.model.findOne({ order: data._id, shop: shop._id })
                data.save()

                orderIds = orderIds.filter(o => o != order.id)

                return data
            }))

            let newOrders = await Promise.all(orderIds.map(async id => {
                let corresponding = ordersData.find(o => o.id == id)

                let data = await Entities.shopOrder.model.create({
                    ...corresponding,
                    shop: shop._id,
                    owner: shop.owner
                })

                data.review = await Entities.shopReview.model.findOne({ order: data._id, shop: shop._id })
                data.save()

                return data
            }))

            resolve([ ...shop.orders, ...newOrders.map(l => l._id) ])
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

const syncListings = async function (shop, syncImages = false) {
    return new Promise(async (resolve, reject) => {
        try {
            let limit = 5

            let listingData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shop.id}/listings?limit=${limit}&language=fr`, { 
                headers: {
                    'x-api-key': process.env.ETSY,
                    Authorization: `Bearer ${shop.etsyToken}`,
                }
            })

            let count = listingData.count

            async function getListingData (data) {
                let ids = data.results.map(r => r.listing_id)
                let listingImages = await $fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${ids.join(',')}&includes=Images`, { headers: {
                    'x-api-key': process.env.ETSY,
                    Authorization: `Bearer ${shop.etsyToken}`,
                } })

                listingImages = listingImages.results.reduce((t, c) => ({ ...t, [c.listing_id]: c.images }), {})

                return data.results.map(listing => ({
                    id: listing.listing_id,
                    title: cleanString(listing.title),
                    status: listing.state,
                    price: listing.price,
                    link: listing.url,
                    quantity: listing.quantity,
                    favorites: listing.num_favorers,
                    tags: listing.tags,
                    images: listingImages[listing.listing_id].map(r => ({
                        thumbnail: r.url_75x75,
                        small: r.url_570xN,
                        full: r.url_fullxfull,
                    }))
                }))
            }
            
            listingData = await getListingData(listingData)

            for (let i = 0; i < Math.ceil(count / limit) - 1; i++) {
                let newData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shop.id}/listings?limit=${limit}&offset=${limit * (i + 1)}&language=fr`, { 
                    headers: {
                        'x-api-key': process.env.ETSY,
                        Authorization: `Bearer ${shop.etsyToken}`,
                    }
                })

                newData = await getListingData(newData)

                listingData = [ ...listingData, ...newData]
            }

            let listingIds = listingData.map(i => i.id)
            let listingsToUpdate = await Entities.shopListing.model.find({ shop: shop._id, id: { $in: listingIds } })

            await Promise.all(listingsToUpdate.map(async listing => {
                let corresponding = listingData.find(l => l.id == listing.id)
                let data = await Entities.shopListing.model.findByIdAndUpdate(listing._id, corresponding)

                listingIds = listingIds.filter(l => l != listing.id)

                return data
            }))

            let newListings = await Promise.all(listingIds.map(async id => {
                let corresponding = listingData.find(l => l.id == id)

                let data = await Entities.shopListing.model.create({
                    ...corresponding,
                    shop: shop._id,
                    owner: shop.owner
                })

                return data
            }))

            resolve([ ...shop.listings, ...newListings.map(l => l._id) ])
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

const syncReviews = async function (shop) {
    return new Promise(async (resolve, reject) => {
        try {
            let reviewsData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shop.id}/reviews?limit=20&language=fr`, { headers: {
                'x-api-key': process.env.ETSY,
                Authorization: `Bearer ${shop.etsyToken}`,
            }})

            reviewsData = await Promise.all(reviewsData.results.map(async review => {
                return {
                    id: review.transaction_id + '-' + review.listing_id,
                    rating: review.rating,
                    comment: cleanString(review.review),
                    listingId: review.listing_id,
                    transactionId: review.transaction_id,
                    image: review.image_url_fullxfull,
                    userId: review.buyer_user_id,
                    reviewDate: new Date(review.create_timestamp)
                }
            }))

            async function getReviewData (reviewsData, shop) {
                let reviews = []

                for (let review of reviewsData) {
                    let data = await Entities.shopReview.model.findOne({ id: review.id, shop: shop._id })
                    let order = await Entities.shopOrder.model.findOne({ transactionId: review.transactionId, shop: shop._id })

                    if (data) {
                        data.rating = review.rating
                        data.comment = review.comment
                        data.order = order ? order._id : null,

                        data.save()
                    } else {
                        let listing = await Entities.shopListing.model.findOne({ id: review.listingId, shop: shop._id })

                        data = await Entities.shopReview.model.create({
                            ...review,
                            listing: listing ? listing._id : undefined,
                            shop: shop._id,
                            order: order ? order._id : null,
                            owner: shop.owner
                        })
                    }

                    if (!data.user) {
                        let user = await $fetch(`https://openapi.etsy.com/v3/application/users/${data.userId}`, { headers: {
                            'x-api-key': process.env.ETSY,
                            Authorization: `Bearer ${shop.etsyToken}`,
                        }})

                        data.user = {
                            name: user.first_name,
                            lastname: user.last_name
                        }

                        data.save()
                    }

                    reviews.push(data)
                }

                return reviews
            }

            reviewsData = await getReviewData(reviewsData, shop)

            resolve(reviewsData.map(l => l._id))
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}