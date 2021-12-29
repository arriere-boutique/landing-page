const Entities = require('../entities')
const shortid = require('shortid')
const WORDS = require('../../static/words.json')

exports.checkout = async function (req, res) {
    let errors = []

    let id = WORDS[Math.floor(Math.random() * 9)] + '-' + shortid.generate()

    let OrderEntity = Entities['order']
    OrderEntity.model.create({
      id,
      items: req.body.items.map(item => item.variation._id),
      order: req.body.items.map(item => ({
        price: item.variation._id,
        quantity: item.quantity
      }))
    })

    let options = {
        line_items: req.body.items.map(item => ({
          price: item.variation.stripeId,
          quantity: item.quantity
        })),
        mode: 'payment',
        success_url: process.env.BASE_URL + `/shop/ta-commande`,
        cancel_url: process.env.BASE_URL + `/shop`,
        metadata: {
          orderId: ''
        }
    }

    if (req.body.shipping) {
        options = {
            ...options,
            shipping_address_collection: {
                allowed_countries: ['FR'],
            },
            shipping_options: [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: 0,
                      currency: 'eur',
                    },
                    display_name: 'Livraison gratuite',
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 2,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 5,
                      },
                    }
                  }
                }
            ]
        }
    }

    const session = await req.app.locals.stripe.checkout.sessions.create(options)

    res.send({
        data: { url: session.url }, errors,
        status: errors.length > 0 ? 0 : 1
    })
}