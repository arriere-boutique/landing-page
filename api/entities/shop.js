const mongoose = require('mongoose')

let ShopEntity = {
    read: 'public',
    write: 'self',
    fields: new mongoose.Schema({
        category: { type: String, write: 'self', read: 'self' },
        categoryCustom: { type: String, write: 'self', read: 'self' },
        name: { type: String, write: 'self' },
        id: { type: String, write: 'self', read: 'self' },
        slug: { type: String, write: 'self' },
        link: { type: String, write: 'self', read: 'public' },
        logo: { type: String, write: 'self', read: 'public' },
        openingDate: { type: Date, write: 'self', read: 'self' },
        etsyId: { type: String, write: 'self', read: 'self' },
        etsyToken: { type: String, write: 'self', read: 'self' },
        etsyRefreshToken: { type: String, write: 'self', read: 'self' },
        etsyRefreshed: { type: Date, write: 'self', read: 'self' },
        orders: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'shopOrder', read: 'self' }
        ],
        listings: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'shopListing', read: 'self' }
        ],
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', read:'self', ref: 'user' }
    }, { timestamps: true })
}

ShopEntity.fields.pre('find', function () {
    this.populate('listings')
    this.populate('orders')
})

ShopEntity.model = global.ShopEntity ? global.ShopEntity.model : mongoose.model('shop', ShopEntity.fields)
global.ShopEntity = ShopEntity

module.exports = ShopEntity