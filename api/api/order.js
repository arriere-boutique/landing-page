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
    let user = await authenticate(req.headers)
    let errors = []
    let data = {}

    try {
        if (!user) throw Error('no-user-no-order')

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

        if (!order && req.body.price) {
            order = await Entities.order.model.create({
                id: WORDS[Math.floor(Math.random() * 9)] + '-' + shortid.generate(),
                intent: intent.id, 
                secret: intent.client_secret,
                price: intent.amount,
                type: req.body.type,
                metadata: req.body.metadata,
                owner: user._id
            })
        }

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

exports.confirmOrder = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = {}

    try {
        if (!req.body.id || !req.body.secret) throw Error('missing-params')

        let order = await Entities.order.model.findOne({ intent: req.body.id, secret: req.body.secret, owner: user._id })
        if (!order) throw Error('order-not-found')
        
        let intent = await req.app.locals.stripe.paymentIntents.retrieve(
            order.intent
        )

        if (!intent) throw Error('intent-not-found')

        if (intent.status == 'succeeded') {
            order.completed = true
            order.save()
        }

        data = { success: order.completed }
    } catch (e) {
        console.warn(e)

        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}