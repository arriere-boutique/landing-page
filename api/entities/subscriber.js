const mongoose = require('mongoose')

let SubscriberEntity = {
    read: 'public',
    write: 'public',
    fields: new mongoose.Schema({
        email: { type: String, write: 'public' },
        frequency: { type: String, write: 'public' },
    }, { timestamps: true })
}

SubscriberEntity.model = global.SubscriberEntity ? global.SubscriberEntity.model : mongoose.model('subscriber', SubscriberEntity.fields)
global.SubscriberEntity = SubscriberEntity

module.exports = SubscriberEntity