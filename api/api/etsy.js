const Entities = require('../entities')
const shortid = require('shortid')
const { $fetch } = require('ohmyfetch/node')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

exports.ping = async function (req, res) {
    let errors = []

    const response = await $fetch('https://openapi.etsy.com/v3/application/openapi-ping', {
        method: 'GET',
        headers: {
            'x-api-key': process.env.ETSY,
        }
    })

    res.send({
        data: response, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.syncEtsy = async function (req, res) {
    let errors = []
    let data = null
    let user = await authenticate(req.headers)

    const headers = {
        'x-api-key': process.env.ETSY,
        Authorization: `Bearer ${user.etsyToken}`,
    }

    try {
        const userData = await $fetch('https://openapi.etsy.com/v3/application/users/' + user.etsyId, { headers })
        const shopData = await $fetch(`https://openapi.etsy.com/v3/application/users/${user.etsyId}/shops`, { headers })
        const listingsData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shopData.shop_id}/listings?limit=5`, { headers }) 
    
        listingsData.results = await Promise.all(listingsData.results.map(async listing => {
            let images = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shopData.shop_id}/listings/${listing.listing_id}/images`, { headers })

            return {
                ...listing,
                images: images.results
            }
        }))
        
        data = {
            user: userData,
            shop: shopData,
            listings: listingsData.results
        }

        console.log(data)
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}