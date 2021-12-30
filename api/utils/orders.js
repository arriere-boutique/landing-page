const Entities = require('../entities')

exports.getPrice = async function (order) {
    return new Promise(async resolve => {
        let variations = await Entities.productVariation.model.find({ '_id': { $in: order.items } })

        resolve({
            total: getTotal(order.items, variations)
        })
    })
}

const getTotal = function (items, variations) {
    return items.reduce((total, variation) => {
        let found = variations.find(v => v._id.equals(variation))      
        return total += found.price
    }, 0)
}
