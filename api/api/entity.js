const mongoose = require('mongoose')
const shortid = require('shortid')
const sharp = require('sharp')
const fs = require('fs')
const mime = require('mime')
const { authenticate } = require('../utils/user')

const Entities = require('../entities')

exports.getEntities = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = []

    try {
        let Entity = req.query.type ? Entities[req.query.type] : null
        let result = null

        if (!Entity) throw 'entity-not-found'

        if (req.query._id) {
            result = await Entity.model.find({ _id: req.query._id })

            if (!result[0]) throw 'id-not-found' 
        } else {
            let query = req.query
            let parsedQuery = query
            delete query.type
            
            Object.keys(query).forEach((key, value) => {
                value = query[key]
                
                if (key.startsWith('$or')) {
                    if (value) {
                        let fieldName = key.replace('$or', '').toLowerCase()

                        value = value.split(',').map(v => ({
                            [fieldName]: v
                        }))

                        parsedQuery.$or = value
                    }

                    delete parsedQuery[key]
                }
            })

            result = await Entity.model.find(parsedQuery)
        }
        
        if (!result) throw 'search-not-found'
        if (!accessCheck('read', Entity, result, user)) throw 'unauthorized'

        result = result.map(v => fieldsCheck('read', v._doc, Entity, v, user))

        data = req.query._id ? result[0] : (typeGetters[req.query.type] ? typeGetters[req.query.type](result) : result)
    } catch (err) {
        console.error(err)
        errors.push({ code: err.code, message: err.errmsg })
    }
    
    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.createEntity = async function (req, res) {
    let user = await authenticate(req.headers)
    console.log(user)

    let errors = []
    let data = {}
    
    try {
        let params = req.body.params ? req.body.params : {}
        let fields = params

        let Entity = req.body.type ? Entities[req.body.type] : null
        if (!Entity) throw 'no-entity-type'

        let result = req.body._id ? await Entity.model.findById(req.body._id) : null

        if (!accessCheck('write', Entity, result, user)) throw 'unauthorized'

        fields = fieldsCheck('write', fields, Entity, result, user)
        delete fields._id

        if (typeSetters[req.body.type]) {
            fields = await typeSetters[req.body.type](fields, req)
        }


        if (result) {
            data = await Entity.model.findByIdAndUpdate(req.body._id, fields)
        } else {
            data = await Entity.model.create(fields)
        }

        if (!data) throw 'error'

        data = await Entity.model.find({ _id: data._id })
        data = fieldsCheck('read', data[0]._doc, Entity, data[0], user)
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.deleteEntity = async function (req, res) {
    let user = await authenticate(req.headers)

    let errors = []
    
    try {
        if (!req.query._id) throw 'no-id-supplied'
    
        let Entity = req.query.type ? Entities[req.query.type] : null
        if (!Entity) throw 'no-entity-type'

        let result = await Entity.model.findById(req.query._id)
        if (!accessCheck('write', Entity, result, user)) throw 'unauthorized'

        await result.remove()
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        errors,
        status: errors.length > 0 ? 0 : 1
    })
}

const ROLES = {
    private: 999,
    admin: 99,
    self: 90,
    editor: 50,
    guest: 10,
    public: 0
}

const accessCheck = (type = 'write', entity, requested = null, user = null) => {
    let granted = false

    if (entity[type] == 'self') {
        let owner = requested ? requested.owner : null
        let requester = user ? user._id : null

        granted = requester && owner && owner.equals(requester)
    } else {
        let userRole = user ? ROLES[user.role] : 0
        let requiredRole = ROLES[entity[type]]

        granted = userRole >= requiredRole
    }

    if (!granted) console.warn('access-denied')

    return granted
}

const fieldsCheck = (type = 'write', data = {}, entity, requested = null, user = null) => {
    let result = { ...data }
    let fields = entity.fields.obj

    Object.keys(fields).forEach(key => {
        if (fields[key][type]) {
            let granted = false
            let requiredRole = fields[key][type] || 'public'

            if (requiredRole == 'self') {
                let owner = requested ? requested.owner : null
                let requester = user ? user._id : null

                granted = requester && owner && owner.equals(requester)
            } else {
                granted = (user ? ROLES[user.role] : 0) >= ROLES[requiredRole]
            }

            if (!granted) {
                console.warn(key + ' not granted')
                delete result[key]
            }
        }
    })

    return result
}

const typeGetters = {

}

const typeSetters = {
    mediaCollection: async (params, req) => {
        return new Promise(async (resolve, reject) => {
            let file = req.file

            try {    
                const SIZES = [
                    { id: 's', width: 400 },
                    { id: 'm', width: 1000 },
                ]

                let medias = await Promise.all(SIZES.map(async size => {
                    let original = await sharp(file.path).metadata()
                    let buffer = await sharp(file.path).resize(Math.min(original.width, size.width)).toBuffer()
                    let metadata = await sharp(buffer).metadata()
        
                    const fileDirectory = `library/${shortid.generate()}-${size.id}.${mime.getExtension(file.mimetype)}`
                    const src = await new Promise(resolve => {
                        req.app.locals.s3.putObject({
                            Bucket: process.env.S3_BUCKET, Key: fileDirectory, Body: buffer
                        }, (err, data) => {
                            resolve(`https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${fileDirectory}`)
                        })
                    })
        
                    let media = await mongoose.model('media').create({
                        id: fileDirectory,
                        width: metadata.width,
                        height: metadata.height,
                        size: size.id,
                        src: src
                    })
        
                    fs.unlink(file.path, () => {})
                    return media._id
                }))

                resolve({ ...params, medias })
            } catch (e) {
                fs.unlink(file.path, () => {})
                reject (e)
            }
        })
    },
    product: async (params) => {
        return new Promise(async (resolve, reject) => {
            try {
                let variations = await Promise.all(params.variations.map(async variation => {
                    let Entity = Entities['productVariation']

                    let item = null
                    let result = variation._id ? await Entity.model.findById(variation._id) : null

                    if (result) {
                        item = await Entity.model.findByIdAndUpdate(variation._id, variation)
                    } else {
                        item = await Entity.model.create(variation)
                    }
                    
                    return item ? item._id : null
                }))

                resolve({ ...params, variations })
            } catch (e) {
                reject (e)
            }
        })
    },
}