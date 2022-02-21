const mongoose = require('mongoose')

let ShopOrderEntity = {
    read: 'self',
    write: 'self',
    fields: new mongoose.Schema({
        id: { type: String },
        transactionId: { type: String },
        
        userId: { type: String },
        email: { type: String },
        name: { type: String },
        adress1: { type: String },
        adress2: { type: String },
        zip: { type: String },
        city: { type: String },
        country: { type: String },
        state: { type: String },
        status: { type: String },

        message: { type: String },
        isGift: { type: Boolean },
        giftMessage: { type: String },

        listings: { type: Array },

        subTotal: { type: Object },
        totalDiscount: { type: Object },
        totalGiftWrap: { type: Object },
        totalPrice: { type: Object },
        totalShipping: { type: Object },
        total: { type: Object },

        shipUpgrade: { type: String },
        shipments: { type: Array, default: () => [] },
        prepared: { type: Array, default: () => [] },

        shop: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shop' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' },
        review: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shopReview' },

        orderDate: { type: Number },
        expectedDate: { type: Number },
        shippedDate: { type: Number },
    }, { timestamps: true })
}

ShopOrderEntity.fields.pre('find', function () {
    this.populate('review')
})

ShopOrderEntity.fields.pre('findOne', function () {
    this.populate('review')
})

ShopOrderEntity.model = global.ShopOrderEntity ? global.ShopOrderEntity.model : mongoose.model('shopOrder', ShopOrderEntity.fields)
global.ShopOrderEntity = ShopOrderEntity

module.exports = ShopOrderEntity