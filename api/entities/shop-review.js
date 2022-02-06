const mongoose = require('mongoose')

let ShopReviewEntity = {
    read: 'public',
    write: 'self',
    fields: new mongoose.Schema({
        id: { type: String },
        comment: { type: String },
        rating: { type: Number },
        image: { type: String },
        userId: { type: String },
        user: { type: Object },
        reviewDate: { type: Date },

        listing: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shopListing' },
        shop: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shop' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' },
    }, { timestamps: true })
}

ShopReviewEntity.model = global.ShopReviewEntity ? global.ShopReviewEntity.model : mongoose.model('shopReview', ShopReviewEntity.fields)
global.ShopReviewEntity = ShopReviewEntity

module.exports = ShopReviewEntity