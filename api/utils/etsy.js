
const moment = require('moment')
const Entities = require('../entities')
const { $fetch } = require('ohmyfetch/node')

exports.syncShop = async function (id, syncImages = false) {
    return new Promise(async (resolve, reject) => {

        try {
            const shop = await Entities.shop.model.findById(id)

            if (moment(shop.etsyRefreshed).isBefore(moment())) {
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

                shop.etsyToken = refresh.access_token
                shop.etsyRefreshed = moment().add(refresh.expires_in - 600, 's')
                shop.etsyRefreshToken = refresh.refresh_token

                shop.save()
            }
        
            const headers = {
                'x-api-key': process.env.ETSY,
                Authorization: `Bearer ${shop.etsyToken}`,
            }

            const shopData = await $fetch(`https://openapi.etsy.com/v3/application/users/${shop.etsyId}/shops`, { headers })

            shop.name = shopData.shop_name
            shop.link = shopData.url
            shop.logo = shopData.icon_url_fullxfull
            shop.id = shopData.shop_id
            shop.openingDate = shopData.create_date

            shop.save()

            try {
                let listingData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shopData.shop_id}/listings?limit=100&language=fr`, { headers })

                async function getListingData () {
                    let results = []

                    for (let listing of listingData.results) {
                        let data = {
                            id: listing.listing_id,
                            title: listing.title,
                            status: listing.state,
                            price: listing.price,
                            link: listing.url,
                            quantity: listing.quantity,
                            favorites: listing.num_favorers,
                            tags: listing.tags
                        }

                        if (syncImages) {
                            let listingImages = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shopData.shop_id}/listings/${listing.listing_id}/images`, { headers })
                            
                            if (listingImages) {
                                data.images = listingImages.results.map(r => ({
                                    thumbnail: r.url_75x75,
                                    small: r.url_570xN,
                                    full: r.url_fullxfull,
                                }))
                            }
                        }

                        results.push(data)
                    }

                    return results
                }
                
                listingData = await getListingData()

                let listingIds = listingData.map(i => i.id)
                let listingsToUpdate = await Entities.shopListing.model.find({ id: { $in: listingIds } })

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

                shop.listings = [ ...shop.listings, ...newListings.map(l => l._id) ]
                shop.save()
            } catch (e) {
                console.warn('Listing update failed')
                console.error(e)
            }

            try {
                let ordersData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shopData.shop_id}/receipts?limit=100&language=fr`, { headers })

                ordersData = await Promise.all(ordersData.results.map(async order => {
                    let listings = []
                    
                    listings = await Promise.all(order.transactions.map(async listing => {
                        let existing = await Entities.shopListing.model.findOne({ id: listing.listing_id })

                        return {
                            listingId: existing ? existing._id : null,
                            title: listing.title,
                            price: listing.price,
                            quantity: listing.quantity,
                            sku: listing.sku,
                            shipping_cost: listing.shipping_cost
                        }
                    }))

                    let transaction = order.transactions[0] ? order.transactions[0] : null

                    console.log(order)
                    
                    return {
                        id: order.receipt_id,
                        listings,
                        email: order.buyer_email,
                        name: order.name,
                        orderDate: order.create_timestamp,
                        shippedDate: transaction ? transaction.shipped_timestamp : undefined,
                        expectedDate: transaction ? transaction.expected_ship_date : undefined,
                        adress1: order.first_line,
                        adress2: order.second_line,
                        zip: order.zip,
                        city: order.city,
                        status: order.status,
                        isGift: order.is_gift,
                        subTotal: order.subtotal,
                        totalDiscount: order.discount_amt,
                        totalGiftWrap: order.gift_wrap_price,
                        totalPrice: order.total_price,
                        totalShipping: order.total_shipping_cost,
                        total: order.grandtotal,
                        giftMessage: order.gift_message
                    }
                }))

                let orderIds = ordersData.map(i => i.id)
                let ordersToUpdate = await Entities.shopOrder.model.find({ id: { $in: orderIds } })

                await Promise.all(ordersToUpdate.map(async order => {
                    let corresponding = ordersData.find(o => o.id == order.id)
                    let data = await Entities.shopOrder.model.findByIdAndUpdate(order._id, corresponding)

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

                    return data
                }))

                shop.orders = [ ...shop.orders, ...newOrders.map(l => l._id) ]
                shop.save()
            } catch (e) {
                console.warn('Order update failed')
                console.error(e)
            }

            resolve(shop)
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}