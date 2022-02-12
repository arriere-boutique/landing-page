require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const multer  = require('multer');
const AWS = require('aws-sdk')
const { Nuxt, Builder } = require('nuxt')
const AutoIncrementFactory = require('mongoose-sequence');
const stripe = require('stripe')(process.env.STRIPE)
const SibApiV3Sdk = require('sib-api-v3-sdk');
let sendinBlue = SibApiV3Sdk.ApiClient.instance;
let apiKey = sendinBlue.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE

const app = express()

require('./entities/index')
const { createEntity, getEntities, deleteEntity } = require('./api/entity');
const { logUser, logOut, getUser, requestResetPassword, resetPassword, getActiveSubscription } = require('./api/user');
const { createOrder, checkoutOrder, confirmOrder } = require('./api/order');
const { webhooks } = require('./api/webhooks');
const { createSubscriber, getSubscribers, deleteSubscriber } = require('./api/subscribe')
const { ping, syncEtsy, linkShop, unlinkShop, searchListings } = require('./api/etsy')
const { editSlug, checkSlug } = require('./api/shop')
const { redirect } = require('./api/oauth')
const { sendOrder } = require('./api/shop-order')

app.use(morgan('combined'))
app.use('/webhooks', express.raw({ type: "*/*" }))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
})

const storage = multer.diskStorage({
    destination : 'uploads/',
    limits: { fieldSize: 2 * 1024 * 1024 },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })

app.locals.s3 = s3
app.locals.increment = AutoIncrementFactory(mongoose.connection)
app.locals.stripe = stripe
app.locals.sendinBlue = SibApiV3Sdk

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

mongoose.connection.once('open', async () => {
    app.post('/order', createOrder)
    app.post('/order/checkout', checkoutOrder)
    app.post('/order/confirm', confirmOrder)

    app.post('/webhooks', webhooks)

    app.get('/entities', getEntities)
    app.post('/entities', upload.single('file'), createEntity)
    app.delete('/entities', deleteEntity)

    app.post('/user', logUser)
    app.get('/user', getUser)
    app.post('/user/logout', logOut)
    app.post('/user/reset', requestResetPassword)
    app.post('/user/reset/confirm', resetPassword)
    app.post('/user/subscriptions/active', getActiveSubscription)

    app.post('/subscribe', createSubscriber)
    app.get('/subscribers', getSubscribers)
    app.delete('/subscribe', deleteSubscriber)

    app.get('/etsy/ping', ping)
    app.get('/etsy/search', searchListings)
    
    app.post('/etsy/sync', syncEtsy)
    app.post('/etsy/link', linkShop)
    app.post('/etsy/unlink', unlinkShop)

    app.post('/shop/edit-slug', editSlug)
    app.get('/shop/check-slug', checkSlug)

    app.post('/shop-order/send', sendOrder)

    app.get('/oauth/redirect', redirect)
})

module.exports = app

if (require.main === module) {
    const port = process.env.PORT || 80
    app.listen(port, () => {
        console.log(`============> API server listening on port ${port}`)
    })
}