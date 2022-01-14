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
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('flashes/add', { title: 'Sauvegarde réussie', duration: 2000, type: 'success' }, { root: true })

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Erreur lors de la sauvegarde...')
            }
        }
    }
}