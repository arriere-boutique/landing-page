const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')
const SibApiV3Sdk = require('sib-api-v3-sdk');

const { authenticate } = require('../utils/user')

exports.createSubscriber = async function (req, res) {
    let errors = []
    let data = []

    try {
        if (!req.body.email || !req.body.token) throw 'missing-fields'

        const challenge = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`)

        if (!challenge.success) throw 'challenge-failed'

        let sendinBlue = SibApiV3Sdk.ApiClient.instance;
        let apiKey = sendinBlue.authentications['api-key']
        apiKey.apiKey = process.env.SENDINBLUE

        let apiInstance = new SibApiV3Sdk.ContactsApi()
        let createContact = new SibApiV3Sdk.CreateContact()

        createContact.email = req.body.email
        createContact.listIds = [6]
        createContact.attributes = {
            PRENOM: req.body.name,
            DOMAINE: req.body.shopCategory,
            DOMAINECUSTOM: req.body.shopCategoryCustom,
            NOMBOUTIQUE: req.body.shopName
        }

        let response = await apiInstance.createContact(createContact)
        data = JSON.stringify(response)

        if (!data) throw 'error'
    } catch (err) {
        console.warn(err)
        if (err.response) err = err.response.body.code.replace(/_/g, '-');
        errors.push(err)
    }
    
    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.getSubscribers = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = []

    try {
        if (!user || user.role !== 'admin') throw 'not-authorized'

        data = await Entities['subscriber'].model.find()
    } catch (err) {
        console.error(err)
        errors.push(err)
    }

    res.send({
        data,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

exports.deleteSubscriber = async function (req, res) {
    let errors = []

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}
