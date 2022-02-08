const Entities = require('../entities')
const { $fetch } = require('ohmyfetch/node')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')
const { syncShop } = require('../utils/etsy')
const { URL, URLSearchParams } = require('url');

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

    try {
        data = await syncShop(req.body.id, req.body.syncItems ? req.body.syncItems : ['info', 'listings', 'orders', 'reviews'])
    } catch (e) {
        console.warn(e)
        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.linkShop  = async function (req, res) {
    let errors = []
    let data = null
    let user = await authenticate(req.headers)
    let existed = false
    
    try {
        if (!req.body.etsyId || !req.body.etsyToken) throw Error('missingToken')
        let existing = await Entities.shop.model.findOne({ owner: user._id, etsyId: req.body.etsyId })

        let params = {
            etsyId: req.body.etsyId,
            etsyToken: req.body.etsyToken,
            etsyRefreshToken: req.body.etsyRefresh
        }
        
        if (existing) {
            existed = true
            data = await Entities.shop.model.findByIdAndUpdate(existing._id, params)
        } else {
            data = await Entities.shop.model.create({
                ...params,
                owner: user._id
            })

            let shops = [...user.shops, data._id]
            await Entities.user.model.findByIdAndUpdate(user._id, { shops })
        }

        data = await syncShop(data._id, ['info', 'listings', 'orders', 'listing-photos', 'reviews'], !existed)
    } catch (e) {
        console.warn(e)
        errors.push(e.message)
    }

    if (process.env.NODE_ENV == "PRODUCTION" && data) {
        try {
            let apiInstance = new req.app.locals.sendinBlue.ContactsApi()
            let updateContact = new req.app.locals.sendinBlue.UpdateContact()

            updateContact.email = req.body.email
            updateContact.listIds = req.body.newsletter ? [9, 6] : [9]

            updateContact.attributes = {
                NOMBOUTIQUE: data.name
            }
            
            await apiInstance.updateContact(user.email, updateContact)
        } catch (e) {
            console.error(e)
        }
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.unlinkShop  = async function (req, res) {
    let errors = []
    let data = null
    let user = await authenticate(req.headers)
    
    try {
        let shop = await Entities.shop.model.findById(req.body.id)

        if (!shop) throw Error('shopNotFound')
        if (!shop.owner.equals(user._id)) throw Error('unauthorized')

        await Entities.shopListing.model.deleteMany({ owner: user._id, _id: { $in: shop.listings } })
        await Entities.shopOrder.model.deleteMany({ owner: user._id, _id: { $in: shop.orders } })
        await Entities.shopReview.model.deleteMany({ owner: user._id, _id: { $in: shop.reviews } })
        await Entities.landing.model.deleteMany({ owner: user._id, shop: shop._id })
        await Entities.shop.model.deleteOne({ owner: user._id, _id: shop._id })

        await Entities.user.model.findByIdAndUpdate(user._id, {
            shops: user.shops.filter(s => s != req.body.id)
        })

    } catch (e) {
        console.warn(e)
        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.searchListings = async function (req, res) {
    let errors = []
    let data = null
    let query = { language: 'fr', shop_location: 'france', sort_on: 'updated' }
    let user = await authenticate(req.headers)
    
    try {
        var url = new URL('https://openapi.etsy.com/v3/application/listings/active')

        if (req.query.keywords) query.keywords = req.query.keywords
        if (req.query.limit) query.limit = req.query.limit
        query.offset = req.query.offset ? req.query.offset : 0

        data = Array.from(Array(req.query.samples ? parseInt(req.query.samples) : 1))

        let offset = parseInt(query.offset)
        let limit = query.limit ? parseInt(query.limit) : 50
        let results = await Promise.all(data.map(async (v, i) => {
            // offset = offset + (limit * i)
            // query.offset = offset
            
            // if (!offset) offset = limit

            url.search = new URLSearchParams(query).toString()
            
            try {
                const response = await $fetch(url, {
                    method: 'GET',
                    headers: { 'x-api-key': process.env.ETSY, }
                })

                return response.results
            } catch (e) {
                return []
            }
        }))
        
        data = results.reduce((all, current) => [ ...all, ...current ], [])
    } catch (e) {
        console.warn(e)
        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}