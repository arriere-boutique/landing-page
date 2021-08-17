const mongoose = require('mongoose')

let ReactionEntity = {
    read: 'public',
    write: 'public',
    fields: new mongoose.Schema({
        type: { type: String },
        target: { type: String },
        count: { type: Number },
        owner: { type: String }
    }, { timestamps: true })
}

ReactionEntity.model = global.ReactionEntity ? global.ReactionEntity.model : mongoose.model('reaction', ReactionEntity.fields)
global.ReactionEntity = ReactionEntity

module.exports = ReactionEntity