import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({

    }),
    mutations: {

    },
    actions: { 
        async update ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params,
                    type: 'shopListing'
                })
                
                if (response.errors.length > 0) throw response.errors

                commit('flashes/add', { title: 'Sauvegarde réussie', duration: 2000, type: 'success' }, { root: true })

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Erreur lors de la sauvegarde...')
            }
        }
    }
}