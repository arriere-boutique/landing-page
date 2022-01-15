const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')

const { authenticate } = require('../utils/user')
const { ErrorModel } = require('sib-api-v3-sdk')

exports.logUser = async function (req, res) {
    let errors = []
    let data = []
    let register = req.body.type == 'register'
    let token = null
    let authenticated = false
    let user = null

    try {
        if (req.body.type == 'guest') {
            if (req.body._id) user = await Entities.user.model.findById(req.body._id)
            if (!user) user = await Entities.user.model.create({ role: 'guest' })

            token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 864000
            })

            data = user
        } else {
            if (!req.body.email || !req.body.password || !req.body.token) throw Error('missingFields')
            
            if (process.env.NODE_ENV == "PRODUCTION") {
                const challenge = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`)

                if (!challenge.success) throw Error('challenge-failed')
            }

            user = await Entities.user.model.findOne({ email: req.body.email })
            
            if (register && user) throw Error('alreadyRegistered')
            if (!register && !user) throw Error('emailNotFound')
            
            if (user) {
                authenticated = await user.comparePassword(req.body.password)
            } else if (register) {
                user = await Entities.user.model.create({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    surname: req.body.surname,
                    category: req.body.shopCategory,
                    categoryCustom: req.body.shopCategoryCustom,
                    shopName: req.body.shopName,
                    address: req.body.address,
                    address2: req.body.address2,
                    postalCode: req.body.postalCode,
                    city: req.body.city,
                    country: req.body.country,
                    role: 'user'
                })

                user.owner = user._id
                user.save()
                
                if (!user) throw Error('error')

                authenticated = true

                try {
                    let apiInstance = new req.app.locals.sendinBlue.ContactsApi()
                    let createContact = new req.app.locals.sendinBlue.CreateContact()

                    createContact.email = req.body.email
                    createContact.listIds = req.body.newsletter ? [9, 6] : [9]

                    createContact.attributes = {
                        PRENOM: req.body.name,
                        DOMAINE: req.body.shopCategory ? req.body.shopCategory : 0,
                        DOMAINECUSTOM: req.body.shopCategoryCustom ? req.body.shopCategoryCustom : '',
                        NOMBOUTIQUE: req.body.shopName ? req.body.shopName : ''
                    }
                    
                    if (process.env.NODE_ENV == "PRODUCTION") await apiInstance.createContact(createContact)
                } catch (e) {
                    console.error(e)
                }
            }

            if (authenticated) {
                token = jwt.sign({ id: user._id }, process.env.SECRET, {
                    expiresIn: 864000
                })
            } else {
                throw Error('wrongCredentials')
            }
        }
    } catch (e) {
        console.error(e)
        errors.push(e.message)
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

        if (!user) throw Error('wrongCredentials')

        user.shops = await Promise.all(user.shops.map(async shop => await Entities.shop.model.findById(shop)))
    } catch (e) {
        console.error(e)

        errors.push(e.message)
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
