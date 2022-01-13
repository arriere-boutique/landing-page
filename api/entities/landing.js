const mongoose = require('mongoose')

let LandingEntity = {
    read: 'public',
    write: 'user',
    fields: new mongoose.Schema({
        slug: { type: String, write: 'self' },
        title: { type: String, write: 'self' },
        description: { type: String, write: 'self' },
        logo: { type: String, write: 'self' },
        links: { type: Array },
        customization: { type: Object, write: 'self' },
        shop: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'shop' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'self', ref: 'user' }
    }, { timestamps: true })
}

LandingEntity.model = global.LandingEntity ? global.LandingEntity.model : mongoose.model('landing', LandingEntity.fields)
global.LandingEntity = LandingEntity

module.exports = LandingEntity