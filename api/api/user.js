const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Entities = require('../entities')

const { authenticate } = require('../utils/user')

exports.logUser = async function (req, res) {
    let errors = []
    let data = []
    let register = false
    let token = null
    let authenticated = false

    try {
        if (!req.body.email || !req.body.password) throw 'missing-fields'

        if (req.body.registerToken) {
            register = await mongoose.model('token').findOne({
                value: req.body.registerToken,
                type: 'register',
                expiration: { "$gte": new Date() }
            })
        }

        // register = true

        user = await Entities.user.model.findOne({ email: req.body.email })
        
        if (register && user) throw 'already-registered'
        if (!register && !user) throw 'email-not-found'

        if (user) {
            authenticated = await user.comparePassword(req.body.password)
        } else if (register) {
            await mongoose.model('token').findByIdAndDelete(register._id)

            user = await Entities.user.model.create({
                email: req.body.email,
                role: 'admin',
                password: req.body.password
            })

            user.owner = user._id
            user.save()

            if (!user) throw 'error'

            authenticated = true
        }

        if (authenticated) {
            token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 864000
            })
        } else {
            throw 'wrong-credentials'
        }
    } catch (err) {
        console.error(err)
        errors.push(err)
    }
    
    res.send({
        data, errors, token,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.getUser = async function (req, res) {
    let errors = []
    let user = null

    try {
        user = await authenticate(req.headers)
        if (!user) throw 'wrong-credentials'
    } catch (err) {
        console.error(err)
        errors.push(err)
    }

    res.send({
        user, status: errors.length > 0 ? 0 : 1,
        errors
    })
}

exports.logOut = async function (req, res) {
    let errors = []

    res.send({
        token: null, status: errors.length > 0 ? 0 : 1,
        errors
    })
}