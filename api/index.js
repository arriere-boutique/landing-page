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
const { logUser, logOut, getUser } = require('./api/user');
const { createOrder, checkoutOrder } = require('./api/order');
const { webhooks } = require('./api/webhooks');
const { createSubscriber, getSubscribers, deleteSubscriber } = require('./api/subscribe')
const { ping, syncEtsy, linkShop } = require('./api/etsy')
const { redirect } = require('./api/oauth')

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

    app.post('/webhooks', webhooks)

    app.get('/entities', getEntities)
    app.post('/entities', upload.single('file'), createEntity)
    app.delete('/entities', deleteEntity)

    app.post('/user', logUser)
    app.get('/user', getUser)
    app.post('/user/logout', logOut)

    app.post('/subscribe', createSubscriber)
    app.get('/subscribers', getSubscribers)
    app.delete('/subscribe', deleteSubscriber)

    app.get('/etsy/ping', ping)
    app.post('/etsy/sync', syncEtsy)
    app.post('/etsy/link', linkShop)

    app.get('/oauth/redirect', redirect)
})

module.exports = app

if (require.main === module) {
    const port = process.env.PORT || 3001
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`)
    })
}