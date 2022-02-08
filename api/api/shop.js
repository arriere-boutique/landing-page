const Entities = require('../entities')
const { authenticate } = require('../utils/user')

const DOMAINS = ['blog', 'shop', 'boutique', 'mon', 'arriereboutique', 'home', 'dashboard', 'bienvenue', 'bonjour', 'my', 'admin', 'dash', 'app']

exports.editSlug = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = null

    try {
        if (!user) throw Error('no-user')
        if (!req.body.slug || !req.body._id) throw Error('missing-parameter')
        
        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        if (format.test(req.body.slug)) throw Error('special-caracters')
        if (req.body.slug.length < 3) throw Error('too-short')
        if (req.body.slug.length > 20) throw Error('too-long')

        let existing = await Entities.shop.model.find({ slug: req.body.slug.toLowerCase(), _id: { $ne: req.body._id } })

        if (DOMAINS.includes(req.body.slug) || existing.length > 0) throw Error('slug-taken')

        let shop = await Entities.shop.model.findById(req.body._id)

        if (!shop || !shop.owner.equals(user._id)) throw Error('unauthorized')

        shop.slug = req.body.slug.toLowerCase()
        shop.domain = parseInt(req.body.domain)
        shop.save()

        let landings = await Entities.landing.model.find({ shop: shop._id })
        landings.forEach(landing => {
            landing.link = `https://${shop.slug}.${process.env.DOMAINS.split(',')[shop.domain]}${landing.isHome ? '' : '/' + landing.slug}`
            landing.save()
        })

        data = shop
    } catch (e) {
        console.error(e)

        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.checkSlug = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = {
        exists: true
    }

    try {
        if (!user) throw Error('no-user')

        let existing = await Entities.shop.model.find({ slug: req.query.slug.toLowerCase() })

        data.exists = DOMAINS.includes(req.body.slug) || existing.length > 0
    } catch (e) {
        console.error(e)

        errors.push(e.message)
    }

    res.send({
        data, errors,
        status: errors.length > 0 ? 0 : 1
    })
}