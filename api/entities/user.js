const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { generatePassword } = require('../utils/user')

let UserEntity = {
    read: 'admin',
    write: 'self',
    fields: new mongoose.Schema({
        email: { type: String, write: 'self' },
        password: { type: String, write: 'self', read: 'private' },
        role: { type: String, write: 'admin', default: 'guest' },
        name: { type: String, write: 'self' },
        surname: { type: String, write: 'self' },
        address: { type: String, write: 'self' },
        address2: { type: String, write: 'self' },
        city: { type: String, write: 'self' },
        postalCode: { type: String, write: 'self' },
        country: { type: String, write: 'self' },
        category: { type: String, write: 'self' },
        categoryCustom: { type: String, write: 'self' },
        shopName: { type: String, write: 'self' },
        etsyId: { type: String, write: 'self' },
        etsyToken: { type: String, write: 'self' },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    }, { timestamps: true })
}

UserEntity.fields.pre('save', async function(next) {
    var user = this
    if (!user.isModified('password')) return next()

    let hash = await generatePassword(user.password)
    user.password = hash

    next()
})

UserEntity.fields.methods.comparePassword = function(candidatePassword) {
    return new Promise(resolve => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            resolve(isMatch, err)
        })
    })
    
}

UserEntity.model = global.UserEntity ? global.UserEntity.model : mongoose.model('user', UserEntity.fields)
global.UserEntity = UserEntity

module.exports = UserEntity