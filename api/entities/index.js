const mongoose = require('mongoose')

const User = require('./user')
const Event = require('./event')
const MediaCollection = require('./media-collection')
const Media = require('./media')
const Token = require('./token')
const Page = require('./page')
const Article = require('./article')
const Reaction = require('./reaction')
const Subscriber = require('./subscriber')
const Product = require('./product')
const ProductVariation = require('./product-variation')
const Order = require('./order')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

exports.user = User
exports.event = Event
exports.page = Page
exports.article = Article
exports.media = Media
exports.mediaCollection = MediaCollection
exports.reaction = Reaction
exports.subscriber = Subscriber
exports.productVariation = ProductVariation
exports.product = Product
exports.order = Order

exports.Token = mongoose.model('token', Token)