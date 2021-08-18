const mongoose = require('mongoose')

let Article = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        excerpt: { type: String, write: 'editor' },
        content: { type: String, write: 'editor' },
        status: { type: String, write: 'editor' },
        slug: { type: String, write: 'editor'},
        medias: { type: mongoose.Schema.Types.ObjectId, ref: 'mediaCollection', write: 'editor' }
    })
}

Article.fields.pre('find', function () {
    this.populate('medias')
})

Article.model = global.Article ? global.Article.model : mongoose.model('article', Article.fields)
global.Article = Article

module.exports = Article