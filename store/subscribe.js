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
                
                if (response.errors.length > 0) throw response.errors

                return response
            } catch (e) {
                console.error(e)
                throw err
            }
        },
        async fetch ({ commit }) {
            try {
                const response = await this.$axios.$get('/subscribers')
                
                if (response.errors.length > 0) throw response.errors
                
                return response
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async delete ({ commit }, email) {
            try {
                const response = await this.$axios.$delete('/subscribe', {
                    params: { email }
                })
                
                if (response.errors.length > 0) throw response.errors
                
                return response
            } catch (e) {
                console.error(e)
                return e
            }
        }
    }
}