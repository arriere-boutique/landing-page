
exports.checkout = async function (req, res) {
    let errors = []
    let options = {
        line_items: req.body.items,
        mode: 'payment',
        success_url: `https://google.fr`,
        cancel_url: `https://google.fr`
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