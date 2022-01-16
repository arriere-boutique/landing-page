const Entities = require('../entities')
const shortid = require('shortid')
const { $fetch } = require('ohmyfetch/node')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

exports.redirect = async function (req, res) {
    let response = null
    let redirect = process.env.DASHBOARD_URL + '/parametres'
    
    try {
        let token = await Entities.token.model.findOne({ id: req.query.state })

        if (!token) throw Error('token-not-found')

        await Entities.token.model.findByIdAndDelete(token._id)

        let body = {
            grant_type: 'authorization_code',
            client_id: process.env.ETSY,
            redirect_uri: process.env.BASE_URL + '/api/oauth/redirect',
            code: req.query.code,
            code_verifier: token.value,
        }
        if (token.value2) redirect = token.value2

        response = await $fetch('https://api.etsy.com/v3/public/oauth/token', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (e) {
        console.warn(e)
        res.redirect(redirect + '?error=1')
    }
    res.redirect(redirect + `?token=${response.access_token}&refresh=${response.refresh_token}`)
}