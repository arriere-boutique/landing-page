const Entities = require('../entities')
const shortid = require('shortid')
const { $fetch } = require('ohmyfetch/node')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

exports.redirect = async function (req, res) {
    let errors = []
    let response = null
    
    try {
        let token = await Entities.token.model.findOne({ id: req.query.state })

        if (!token) throw 'token-not-found'

        await Entities.token.model.findByIdAndDelete(token._id)

        let body = {
            grant_type: 'authorization_code',
            client_id: process.env.ETSY,
            redirect_uri: process.env.BASE_URL + '/api/oauth/redirect',
            code: req.query.code,
            code_verifier: token.value,
        }

        response = await $fetch('https://api.etsy.com/v3/public/oauth/token', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })

        res.redirect(process.env.BASE_URL + `/compte?error=1`)
    }

    res.redirect(process.env.BASE_URL + `/compte?token=` + response.access_token)
}