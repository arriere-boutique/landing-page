
exports.checkout = async function (req, res) {
    let errors = []

    const session = await req.app.locals.stripe.checkout.sessions.create({
        line_items: req.body.items,
        mode: 'payment',
        success_url: `https://google.fr`,
        cancel_url: `https://google.fr`,
    })

    res.send({
        data: { url: session.url }, errors,
        status: errors.length > 0 ? 0 : 1
    })
}