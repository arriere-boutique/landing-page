const mongoose = require('mongoose')

let Order = {
    write: 'self',
    read: 'self',
    fields: new mongoose.Schema({
        id: { type: String, write: 'self' },
        intent: { type: String, write: 'admin' },
        type: { type: String, write: 'admin' },
        secret: { type: String, write: 'admin' },
        completed: { type: Boolean, default: false, write: 'admin' },
        shipping: { type: String, write: 'self' },
        address: { type: Object, write: 'self' },
        price: { type: Object, write: 'self' },
        status: { type: String, write: 'self' },
        metadata: { type: Object, write: 'admin' },
        items: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'productVariation' }
        ],
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'user' }
    }, { timestamps: true })
}

Order.model = global.Order ? global.Order.model : mongoose.model('order', Order.fields)
global.Order = Order

module.exports = Order