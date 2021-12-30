const Entities = require('../entities')
const shortid = require('shortid')
const WORDS = require('../../static/words.json')

exports.createOrder = async function (req, res) {
    let errors = []
    let data = null
    let id = WORDS[Math.floor(Math.random() * 9)] + '-' + shortid.generate()
    let options = {}

    if (req.body.items) options.items = req.body.items
    
    let existing = await Entities.order.model.findOne({ ...options, owner: req.body.user })
    let difference = existing ? Math.abs(existing.createdAt - Date.now()) / (1000 * 60 * 60 * 24) : null

    if (existing && difference <= 7) {
        data = await Entities.order.model.findByIdAndUpdate(existing._id, options)
    } else {
        data = await Entities.order.model.create({ id, ...options, owner: req.body.user })
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.checkoutOrder = async function (req, res) {
    let errors = []
    let intent = null

    try {
        let order = await Entities.order.model.findOne({ id: req.body.id })
        
        if (!order) throw 'order-not-found'

        intent = await req.app.locals.stripe.paymentIntents.create({
            amount: 200,
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true
            }
        })
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        data: intent.client_secret, errors,
        status: errors.length > 0 ? 0 : 1
    })
}