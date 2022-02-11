const mongoose = require('mongoose')
const shortid = require('shortid')
const sharp = require('sharp')
const fs = require('fs')
const mime = require('mime')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

const Entities = require('../entities')

exports.getEntities = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = []
    let cancel = false
    let idQuery = req.query._id && !req.query._id.includes('$in')

    try {
        let Entity = req.query.type ? Entities[req.query.type] : null
        let result = null

        if (!Entity) throw Error('entity-not-found')

        if (idQuery) {
            result = await Entity.model.find({ _id: req.query._id })

            if (!result[0]) throw Error('id-not-found')
        } else {
            let query = req.query
            delete query.type
            
            let parsed = parseQuery(query, user)
            result = cancel ? [] : await Entity.model.find(parsed.query, null, parsed.options)
        }

        if (!result) throw Error('search-not-found')

        if (Array.isArray(result)) {
            result = result.filter(r => accessCheck('read', Entity, r, user))
        } else if (!accessCheck('read', Entity, result, user)) {
            throw Error('unauthorized')
        }

        result = result.map(v => fieldsCheck('read', v._doc, Entity, v, user))

        data = idQuery ? result[0] : (typeGetters[req.query.type] ? typeGetters[req.query.type](result) : result)
    } catch (e) {
        console.error(e)

        errors.push(e.message)
    }
    
    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.createEntity = async function (req, res) {
    let user = await authenticate(req.headers)

    let errors = []
    let data = {}
    
    try {
        let params = req.body.params ? req.body.params : {}
        let fields = params

        let Entity = req.body.type ? Entities[req.body.type] : null
        if (!Entity) throw Error('no-entity-type')

        let result = req.body._id ? await Entity.model.findById(req.body._id) : null

        if (!accessCheck('write', Entity, result, user)) throw Error('unauthorized')

        fields = result ? fieldsCheck('write', fields, Entity, result, user) : fields
        delete fields._id

        if (typeSetters[req.body.type]) fields = await typeSetters[req.body.type](fields, req)

        fields = parseQuery(fields, user)

        
        if (Entity.unique && fields.query[Entity.unique]) {
            let params = [ Entity.unique, ...Entity.uniqueConditions].reduce((params, key) => {
                if (!fields.query[key]) throw Error('missingDuplicateParameter')

                return { ...params, [key]: fields.query[key] }
            }, {})
            
            let duplicate = await Entity.model.findOne(params)
            if (duplicate && (!result || !duplicate._id.equals(result._id))) throw Error('duplicateFound')
        }

        if (result) {
            data = await Entity.model.findByIdAndUpdate(req.body._id, fields.query)
        } else {
            data = await Entity.model.create(fields.query)
        }

        if (!data) throw Error('error')

        data = await Entity.model.find({ _id: data._id })
        data = fieldsCheck('read', data[0]._doc, Entity, data[0], user)
    } catch (e) {
        console.warn(e)
        console.warn(e)
        errors.push(e.message)
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
        if (!req.query._id) throw Error('no-id-supplied')
    
        let Entity = req.query.type ? Entities[req.query.type] : null
        if (!Entity) throw Error('no-entity-type')

        let result = await Entity.model.findById(req.query._id)
        if (!accessCheck('write', Entity, result, user)) throw Error('unauthorized')

        await result.remove()
    } catch (e) {
        console.warn(e)

        errors.push(e.message)
    }

    res.send({
        errors,
        status: errors.length > 0 ? 0 : 1
    })
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

const parseQuery = function (query, user) {
    let parsedQuery = { ...query }
    let options = {}
    
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

        if (value == '$self') {
            if (user) {
                parsedQuery[key] = user._id
            } else {
                cancel = true
            }
        }
        if (typeof value === 'string' && value.startsWith('$in')) {
            parsedQuery[key] = { '$in': value.replace('$in', '').split(',') }
        }
    })

    if (query['$sort']) {
        options.sort = { [query['$sort']]: query['$sortValue'] }

        delete parsedQuery['$sort']
        delete parsedQuery['$sortValue']
    }

    if (query['$limit']) {
        options.limit = parseInt(query['$limit'])

        delete parsedQuery['$limit']
    }

    return { query: parsedQuery, options }
}