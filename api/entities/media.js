const mongoose = require('mongoose')

let Media = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'editor' },
        width: { type: Number, write: 'editor' },
        height: { type: Number, write: 'editor' },
        size: { type: String, write: 'editor' },
        src: { type: String, write: 'editor' }
    })
}

Media.model = global.Media ? global.Media.model : mongoose.model('media', Media.fields)
global.Media = Media

module.exports = Media