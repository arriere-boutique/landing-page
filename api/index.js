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

const app = express()

require('./entities/index')
const { createEntity, getEntities, deleteEntity } = require('./api/entity');
const { logUser, logOut, getUser } = require('./api/user');
const { createSubscriber, getSubscribers, deleteSubscriber } = require('./api/subscribe')

app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
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

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

mongoose.connection.once('open', async () => {
    app.get('/entities', getEntities)
    app.post('/entities', upload.single('file'), createEntity)
    app.delete('/entities', deleteEntity)

    app.post('/user', logUser)
    app.get('/user', getUser)
    app.post('/user/logout', logOut)

    app.post('/subscribe', createSubscriber)
    app.get('/subscribers', getSubscribers)
    app.delete('/subscribe', deleteSubscriber)
})

module.exports = app

if (require.main === module) {
    const port = process.env.PORT || 3001
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`)
    })
}