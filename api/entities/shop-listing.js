const mongoose = require('mongoose')

let ShopListingEntity = {
    read: 'public',
    write: 'self',
    fields: new mongoose.Schema({
        id: { type: String, write: 'self' },
        title: { type: String, write: 'self' },
        link: { type: String, write: 'self' },
        status: { type: String, write: 'self' },
        quantity: { type: Number, write: 'self' },
        favorites: { type: Number, default: 0, write: 'self' },
        tags: { type: Array, write: 'self' },
        images: { type: Object, write: 'self' },
        price: { type: Object, write: 'self' },
        shippingCost: { type: Number, default: 0, write: 'self' },
        shippingMaterials: { type: Number, default: 0, write: 'self' },
        materials: { type: Array, write: 'self' },
        costs: { type: Object, write: 'self', read: 'self' },
        shop: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shop' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' }
    }, { timestamps: true })
}

ShopListingEntity.model = global.ShopListingEntity ? global.ShopListingEntity.model : mongoose.model('shopListing', ShopListingEntity.fields)
global.ShopListingEntity = ShopListingEntity

module.exports = ShopListingEntity