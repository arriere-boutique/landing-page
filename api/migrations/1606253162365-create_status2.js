const { Event } = require('../entities/index')

/**
 * Make any changes you need to make to the database here
 */
async function up () {
    try {
        await Event.updateMany({ status: { $exists: false } }, {
            '$set': { 'status': 'draft' }
        })
    } catch (e) {
        return false
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
