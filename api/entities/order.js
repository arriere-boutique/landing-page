const mongoose = require('mongoose')

let Order = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'editor' },
        completed: { type: String, default: false, write: 'editor' },
        order: { type: String, write: 'editor' },
        items: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'productVariation' }
        ]
    }, { timestamps: true })
}

Order.model = global.Order ? global.Order.model : mongoose.model('order', Order.fields)
global.Order = Order

module.exports = Order