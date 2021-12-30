const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Entities = require('../entities')

exports.generatePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) reject(err)
            
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) reject(err)

                resolve(hash)
            })
        })
    })
}

exports.authenticate = async function (headers) {
    try {
        let user = null

        if (!headers['authorization']) throw 'no-headers'

        let token = headers['authorization'].split(' ')[1]
        if (!token) throw 'no-token'

        user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
            return new Promise (resolve => {
                let fetched = false

                if (err) throw 'fail-token'
                fetched = Entities.user.model.findOne({ _id: decoded.id }, '-password')

                resolve(!err && fetched ? fetched : false)
            })
        })

        if (!user) throw 'user-not-found'

        return user
    } catch (e) {
        console.warn(e)
        return null
    }
}