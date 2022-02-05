import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    actions: { 
        async fetch ({ commit }, params = {}) {

            try {
                if (!params.query) params.query = {}

                let url = params.query.query ? 'https://api.pexels.com/v1/search' : 'https://api.pexels.com/v1/curated'
                if (!params.query.per_page) params.query.per_page = 15
                if (!params.query.locale) params.query.locale = 'fr-FR'

                const response = await this.$axios.$get(storeUtils.getQuery(url, {
                    ...params.query,
                }), { headers: { Authorization: process.env.PEXELS }})

                if (!response.photos) throw Error('pexels-error')

                return response.photos
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Erreur de connexion à Pexels')
            }
        }
    }
}