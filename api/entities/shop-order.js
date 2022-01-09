const mongoose = require('mongoose')

let ShopOrderEntity = {
    read: 'self',
    write: 'self',
    fields: new mongoose.Schema({
        shop: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shop' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' }
    }, { timestamps: true })
}

ShopOrderEntity.model = global.ShopOrderEntity ? global.ShopOrderEntity.model : mongoose.model('shopOrder', ShopOrderEntity.fields)
global.ShopOrderEntity = ShopOrderEntity

module.exports = ShopOrderEntity