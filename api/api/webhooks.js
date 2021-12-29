
exports.webhooks = async function (req, res) {
    let errors = []
    let event = null

    const sig = req.headers['stripe-signature']

    try {
        event = req.app.locals.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOKS)
    } catch (err) {
        console.error(err)
        res.status(400).send(`Webhook Error: ${err.message}`)
        return
    }

    switch (event.type) {
        case 'charge.succeeded':
            const charge = event.data.object
            let email = charge.billing_details.email
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    res.send()
}