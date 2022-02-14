const mongoose = require('mongoose')

let ShopEntity = {
    read: 'public',
    write: 'self',
    fields: new mongoose.Schema({
        category: { type: String, write: 'self', read: 'self' },
        categoryCustom: { type: String, write: 'self', read: 'self' },
        domain: { type: Number, default: 0, write: 'self', read: 'public' },
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

        lastShopFetch: { type: Date, write: 'self', read: 'self' },
        lastOrderFetch: { type: Date, write: 'self', read: 'self' },
        lastReviewFetch: { type: Date, write: 'self', read: 'self' },
        lastListingFetch: { type: Date, write: 'self', read: 'self' },
        
        reviews: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'shopReview', read: 'public' }
        ],
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
    this.populate('reviews')
})

ShopEntity.model = global.ShopEntity ? global.ShopEntity.model : mongoose.model('shop', ShopEntity.fields)
global.ShopEntity = ShopEntity

module.exports = ShopEntity