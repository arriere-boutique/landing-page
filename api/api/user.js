const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')

const { authenticate } = require('../utils/user')

exports.logUser = async function (req, res) {
    let errors = []
    let data = []
    let register = req.body.type == 'register'
    let token = null
    let authenticated = false

    try {
        if (!req.body.email || !req.body.password || !req.body.token) throw 'missing-fields'

        const challenge = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`)

        // if (!challenge.success) throw 'challenge-failed'

        user = await Entities.user.model.findOne({ email: req.body.email })
        
        if (register && user) throw 'already-registered'
        if (!register && !user) throw 'email-not-found'
        
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
                country: req.body.country
            })

            user.owner = user._id
            user.save()
            
            if (!user) throw 'error'

            authenticated = true

            try {
                let apiInstance = new req.app.locals.sendinBlue.ContactsApi()
                let createContact = new req.app.locals.sendinBlue.CreateContact()

                createContact.email = req.body.email
                createContact.listIds = req.body.newsletter ? [9, 6] : [9]
                createContact.attributes = {
                    PRENOM: req.body.name,
                    DOMAINE: req.body.shopCategory,
                    DOMAINECUSTOM: req.body.shopCategoryCustom,
                    NOMBOUTIQUE: req.body.shopName
                }
                
                // await apiInstance.createContact(createContact)
            } catch (err) {
                console.error(err)
            }
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