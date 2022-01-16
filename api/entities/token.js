const mongoose = require('mongoose')

const TokenEntity = {
    read: 'public',
    write: 'public',
    fields: new mongoose.Schema({
        id: { type: String },
        value: { type: String },
        value2: { type: String },
        type: { type: String },
        expiration: { type: Date }
    }, { timestamps: true })
}

TokenEntity.model = global.TokenEntity ? global.TokenEntity.model : mongoose.model('token', TokenEntity.fields)
global.TokenEntity = TokenEntity

module.exports = TokenEntity