const mongoose = require('mongoose')

let Page = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        excerpt: { type: String, write: 'editor' },
        content: { type: String, write: 'editor' },
        status: { type: String, write: 'editor' },
        slug: { type: String, write: 'editor'},
        image: { type: mongoose.Schema.Types.ObjectId, ref: 'mediaCollection', write: 'editor' }
    })
}

Page.fields.pre('find', function () {
    this.populate('image')
})

Page.model = global.Page ? global.Page.model : mongoose.model('page', Page.fields)
global.Page = Page

module.exports = Page