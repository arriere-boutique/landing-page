const { article } = require('../api/entities/index')

/**
 * Make any changes you need to make to the database here
 */
 async function up () {
  try {
      await article.model.updateMany({ type: { $exists: false } }, {
          '$set': { 'type': 'article' }
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
