const mongoose = require('mongoose')
const AWS = require('aws-sdk')
const Media = require('./media')

let MediaCollection = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        createdDate: { type: Date, default: Date.now },
        medias: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'media' }
        ]
    })
}

MediaCollection.fields.post('findOneAndDelete', async function (doc, next) {
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    })

    await Promise.all(doc.medias.map(async media => {
        media = await Media.model.findById(media)

        s3.deleteObject({
            Bucket: process.env.S3_BUCKET, Key: media.id
        }, (e) => {
            console.log(e)
        })

        await media.remove()

        return true
    }))
    
    next()
})

MediaCollection.fields.pre('find', function () {
    this.populate('medias')
})

MediaCollection.model = global.MediaCollection ? global.MediaCollection.fields : mongoose.model('mediaCollection', MediaCollection.fields)
global.MediaCollection = MediaCollection

module.exports = MediaCollection