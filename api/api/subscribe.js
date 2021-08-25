const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')

const { authenticate } = require('../utils/user')

exports.createSubscriber = async function (req, res) {
    let errors = []
    let data = []

    try {
        if (!req.body.email || !req.body.token) throw 'missing-fields'

        const challenge = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`)
        if (!challenge.success) throw 'challenge-failed'

        let existing = await Entities['subscriber'].model.find({ email: req.body.email })
        if (existing.length > 0) throw 'already-subscribed'

        data = await Entities['subscriber'].model.create({
            email: req.body.email,
            frequency: req.body.frequency ? req.body.frequency : 'biweekly'
        })

        if (!data) throw 'error'

    } catch (err) {
        console.error(err)
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

    res.send({
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
