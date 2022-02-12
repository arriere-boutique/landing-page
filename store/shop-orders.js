import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        }
    },
    actions: { 
        async fetch ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params,
                    type: 'shopOrder'
                }))

                commit('refresh', response.data)

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la récupération des commandes')
            }
        },
        async update ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params,
                    type: 'shopOrder'
                })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data)
                
                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async send ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/shop-order/send', {
                    ...params
                })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    },
    getters: {
        items: (state) => {
            return Object.values(state.items).map(item => {
                return {
                    ...item
                }
            })
        },
        find: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            
            if (search) {
                Object.keys(search).forEach(key => {
                    items = items.filter(item => item[key] == search[key])
                })
            }

            return items.sort((a, b) => b.orderDate - a.orderDate)
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}