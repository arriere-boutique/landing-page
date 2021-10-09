const mongoose = require('mongoose')

const Event = require('./event')
const MediaCollection = require('./media-collection')
const Media = require('./media')
const User = require('./user')
const Token = require('./token')
const Page = require('./page')
const Article = require('./article')
const Reaction = require('./reaction')
const Subscriber = require('./subscriber')
const Product = require('./product')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

exports.user = User
exports.event = Event
exports.page = Page
exports.article = Article
exports.media = Media
exports.mediaCollection = MediaCollection
exports.reaction = Reaction
exports.subscriber = Subscriber
exports.product = Product

exports.Token = mongoose.model('token', Token)