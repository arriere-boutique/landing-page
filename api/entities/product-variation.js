const mongoose = require('mongoose')

let ProductVariation = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'editor' },
        title: { type: String, write: 'editor' },
        price: { type: Number, write: 'editor' },
        digital: { type: Boolean, write: 'editor' },
        available: { type: Boolean, write: 'editor' },
        stripeId: { type: String, write: 'editor' },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', write: 'editor' }
    })
}

Product.fields.pre('find', function () {
    this.populate('product')
})

ProductVariation.model = global.ProductVariation ? global.ProductVariation.model : mongoose.model('productVariation', ProductVariation.fields)
global.ProductVariation = ProductVariation

module.exports = ProductVariation