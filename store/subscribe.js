import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({

    }),
    mutations: {

    },
    actions: { 
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/subscribe', {
                    ...params
                })
                
                if (response.status == 0) throw Error(response.errors[0])

                return response
            } catch (e) {
                console.error(e)
                throw err
            }
        },
        async fetch ({ commit }) {
            try {
                const response = await this.$axios.$get('/subscribers')
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, email) {
            try {
                const response = await this.$axios.$delete('/subscribe', {
                    params: { email }
                })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    }
}