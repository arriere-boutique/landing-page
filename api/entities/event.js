const mongoose = require('mongoose')

let EventEntity = {
    read: 'public',
    write: 'editor',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        location: { type: String, write: 'editor' },
        meetupLink: { type: String, write: 'editor' },
        status: { type: String, write: 'editor' },
        image: { type: mongoose.Schema.Types.ObjectId, ref: 'mediaCollection', write: 'editor' },
        startDate: { type: String, write: 'editor' }
    }, { timestamps: true })
}

EventEntity.fields.pre('find', function () {
    this.populate('image')
})

EventEntity.model = global.EventEntity ? global.EventEntity.model : mongoose.model('event', EventEntity.fields)
global.EventEntity = EventEntity

module.exports = EventEntity