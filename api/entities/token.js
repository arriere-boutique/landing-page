const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    value: { type: String },
    type: { type: String },
    expiration: { type: Date }
})

module.exports = TokenSchema