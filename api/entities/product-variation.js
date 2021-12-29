const mongoose = require('mongoose')

let ProductVariation = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'editor' },
        title: { type: String, write: 'editor' },
        price: { type: Number, write: 'editor' },
        stripeId: { type: String, write: 'editor' },
        available: { type: Boolean, write: 'editor' }
    })
}

ProductVariation.model = global.ProductVariation ? global.ProductVariation.model : mongoose.model('productVariation', ProductVariation.fields)
global.ProductVariation = ProductVariation

module.exports = ProductVariation