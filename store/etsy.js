import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({

    }),
    actions: { 
        async similarTags ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/etsy/search', {
                    ...params
                }))
                
                if (response.errors.length > 0) throw response.errors

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la récupération des données de boutique')
            }
        },
    }
}