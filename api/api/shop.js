const Entities = require('../entities')
const { authenticate } = require('../utils/user')

exports.editSlug = async function (req, res) {
    let user = await authenticate(req.headers)
    let errors = []
    let data = null

    try {
        if (!user) throw Error('no-user')
        if (!req.body.slug || !req.body._id) throw Error('missing-parameter')

        let existing = await Entities.shop.model.find({ slug: req.body.slug.toLowerCase(), _id: { $ne: req.body._id } })

        if (existing.length > 0) throw Error('slug-taken')

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