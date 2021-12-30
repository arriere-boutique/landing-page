const mongoose = require('mongoose')

let Order = {
    write: 'self',
    read: 'self',
    fields: new mongoose.Schema({
        id: { type: String, write: 'self' },
        completed: { type: String, default: false, write: 'self' },
        shipping: { type: String, write: 'self' },
        address: { type: Object, write: 'self' },
        items: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'productVariation' }
        ],
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    }, { timestamps: true })
}

Order.model = global.Order ? global.Order.model : mongoose.model('order', Order.fields)
global.Order = Order

module.exports = Order