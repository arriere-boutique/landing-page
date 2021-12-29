
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
            break;
        case 'checkout.session.completed':
            try {
                const checkout = event.data.object
                
                let apiInstance = new req.app.locals.sendinBlue.TransactionalEmailsApi()
                var sendSmtpEmail = new req.app.locals.sendinBlue.SendSmtpEmail()

                sendSmtpEmail = {
                    to: [{
                        email: checkout.customer_details.email
                    }],
                    templateId: 14,
                    params: {
                        ORDER: checkout.id,
                        TOTAL: checkout.amount_total / 100
                    }
                }
                
                await apiInstance.sendTransacEmail(sendSmtpEmail)

                console.log(checkout)
            } catch (err) {
                console.warn(err)
                errors.push(err)
            }

            break;
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    res.send()
}