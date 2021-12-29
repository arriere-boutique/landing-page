const mongoose = require('mongoose')

let Product = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        subtitle: { type: String, write: 'editor' },
        deliveryMin: { type: Number, write: 'editor' },
        deliveryMax: { type: Number, write: 'editor' },
        deliveryDetails: { type: String, write: 'editor' },
        content: { type: String, write: 'editor' },
        category: { type: String, write: 'editor' },
        available: { type: Boolean, write: 'editor' },
        link: { type: String, write: 'editor' },
        status: { type: String, write: 'editor' },
        slug: { type: String, write: 'editor'},
        medias: { type: mongoose.Schema.Types.ObjectId, ref: 'mediaCollection', write: 'editor' },
        variations: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'productVariation' }
        ]
    }, { timestamps: true })
}

Product.fields.pre('find', function () {
    this.populate('variations')
    this.populate('medias')
})

Product.model = global.Product ? global.Product.model : mongoose.model('product', Product.fields)
global.Product = Product

module.exports = Product