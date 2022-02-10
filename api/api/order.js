const Entities = require('../entities')
const shortid = require('shortid')
const WORDS = require('../../static/words.json')
const { getPrice } = require('../utils/orders')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

exports.createOrder = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = null
    let id = WORDS[Math.floor(Math.random() * 9)] + '-' + shortid.generate()
    let options = {}

    try {
        if (!user) throw Error('no-user-no-order')

        if (req.body.items) options.items = req.body.items
        
        let existing = req.body._id ? await Entities.order.model.findById(req.body._id) : false
        if (existing && existing.completed) {
            if (!accessCheck('write', Entities.order, existing, user)) throw Error('unauthorized')
        }

        if (existing) {
            options.price = await getPrice({ ...existing._doc, ...options })
            options.owner = user._id

            data = await Entities.order.model.findByIdAndUpdate(existing._id, options)
        } else {
            data = await Entities.order.model.create({ id, ...options, owner: user._id })
            data.price = await getPrice(data)
            data.save()
        }

        data = await Entities.order.model.find({ _id: data._id })
        data = fieldsCheck('read', data[0]._doc, Entities.order, data[0], user)
    } catch (e) {
        console.error(e)

        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.checkoutOrder = async function (req, res) {
    let errors = []
    let data = {}

    try {
        let order = req.body.id ? await Entities.order.model.findById(req.body.id) : null
        if (!order && !req.body.price) throw Error('order-not-found')
        
        let intent = await req.app.locals.stripe.paymentIntents.create({
            amount: order ? order.price.total : req.body.price,
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true
            }
        })

        if (!intent) throw Error('stripe-intent-failed')

        data.token = intent.client_secret
    } catch (e) {
        console.warn(e)

        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}