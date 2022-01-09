const Entities = require('../entities')
const { $fetch } = require('ohmyfetch/node')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')
const { syncShop } = require('../utils/etsy')

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
        data = await syncShop(req.body.id)
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
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
    
    try {
        if (!req.body.etsyId || !req.body.etsyToken) throw 'missingToken'
        let existing = await Entities.shop.model.findOne({ owner: user._id, etsyId: req.body.etsyId })

        let params = {
            etsyId: req.body.etsyId,
            etsyToken: req.body.etsyToken,
            etsyRefreshToken: req.body.etsyRefresh
        }
        
        if (existing) {
            data = await Entities.shop.model.findByIdAndUpdate(existing._id, params)
        } else {
            data = await Entities.shop.model.create({
                ...params,
                owner: user._id
            })

            let shops = [...user.shops, data._id]
            await Entities.user.model.findByIdAndUpdate(user._id, { shops })
        }

        data = await syncShop(data._id, true)
    } catch (err) {
        console.warn(err)

        errors.push({
            code: err.code,
            message: err.errmsg ? err.errmsg : err
        })
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

        if (!shop) throw 'shopNotFound'
        if (!shop.owner.equals(user._id)) throw 'unauthorized'

        await Entities.shopListing.model.deleteMany({ owner: user._id, _id: { $in: shop.listings } })
        await Entities.shopOrder.model.deleteMany({ owner: user._id, _id: { $in: shop.orders } })
        await Entities.shop.model.deleteOne({ owner: user._id, _id: shop._id })

    } catch (err) {
        console.warn(err)

        errors.push({
            code: err.code,
            message: err.errmsg ? err.errmsg : err
        })
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}