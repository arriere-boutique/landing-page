const mongoose = require('mongoose')

let ShopOrderEntity = {
    read: 'self',
    write: 'self',
    fields: new mongoose.Schema({
        id: { type: String },
        email: { type: String },
        name: { type: String },
        adress1: { type: String },
        adress2: { type: String },
        zip: { type: String },
        city: { type: String },
        status: { type: String },
        isGift: { type: Boolean },
        giftMessage: { type: String },
        listings: { type: Array },
        shop: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shop' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' },
        orderDate: { type: Number }
    }, { timestamps: true })
}

ShopOrderEntity.model = global.ShopOrderEntity ? global.ShopOrderEntity.model : mongoose.model('shopOrder', ShopOrderEntity.fields)
global.ShopOrderEntity = ShopOrderEntity

module.exports = ShopOrderEntity