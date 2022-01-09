const mongoose = require('mongoose')

let ShopEntity = {
    read: 'self',
    write: 'self',
    fields: new mongoose.Schema({
        category: { type: String, write: 'self' },
        categoryCustom: { type: String, write: 'self' },
        name: { type: String, write: 'self' },
        id: { type: String, write: 'self' },
        link: { type: String, write: 'self' },
        logo: { type: String, write: 'self' },
        openingDate: { type: Date, write: 'self' },
        etsyId: { type: String, write: 'self' },
        etsyToken: { type: String, write: 'self' },
        etsyRefreshToken: { type: String, write: 'self' },
        etsyRefreshed: { type: Date, write: 'self' },
        orders: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'shopOrder' }
        ],
        listings: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'shopListing' }
        ],
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' }
    }, { timestamps: true })
}

ShopEntity.fields.pre('find', function () {
    this.populate('listings')
    this.populate('orders')
})

ShopEntity.model = global.ShopEntity ? global.ShopEntity.model : mongoose.model('shop', ShopEntity.fields)
global.ShopEntity = ShopEntity

module.exports = ShopEntity