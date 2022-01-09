
const Entities = require('../entities')
const { $fetch } = require('ohmyfetch/node')

exports.syncShop = async function (id) {
    return new Promise(async (resolve, reject) => {

        try {
            const shop = await Entities.shop.model.findById(id)

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

            let listingData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shopData.shop_id}/listings?limit=100&language=fr`, { headers })

            listingData = listingData.results.map(listing => ({
                id: listing.listing_id,
                title: listing.title,
                link: listing.url,
                quantity: listing.quantity,
                favorites: listing.num_favorers,
                tags: listing.tags
            }))

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

            resolve(shop)
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}