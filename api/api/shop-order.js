const Entities = require('../entities')
const { authenticate } = require('../utils/user')
const { $fetch } = require('ohmyfetch/node')

exports.sendOrder = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = null

    try {
        if (!user) throw Error('no-user')
        if (!req.body._id) throw Error('missing-parameter')

        let shopOrder = await Entities.shopOrder.model.findOne({
            _id: req.body._id,
            owner: user._id
        })

        let shop = await Entities.shop.model.findOne({
            _id: shopOrder.shop,
            owner: user._id
        })

        if (!shopOrder || !shop) throw Error('no-order-found')

        let orderData = await $fetch(`https://openapi.etsy.com/v3/application/shops/${shop.id}/receipts/${shopOrder.id}/tracking`, {
            method: 'POST',
            body: {
                tracking_code: req.body.trackingCode,
                carrier_name: req.body.carrier,
                send_bcc: req.body.bcc,
            },
            headers: {
                'x-api-key': process.env.ETSY,
                Authorization: `Bearer ${shop.etsyToken}`,
            }
        })

        shopOrder.shipments = orderData.shipments
        shopOrder.status = orderData.status
        shopOrder.save()

        data = await Entities.shopOrder.model.findOne({ _id: shopOrder._id })
    } catch (e) {
        console.error(e)

        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}