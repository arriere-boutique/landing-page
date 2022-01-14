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
                    type: 'landing'
                }))

                commit('refresh', response.data)

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la récupération des pages')
            }
        },
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'landing'
                }))
   
                if (params.update !== false) commit('updateOne', Array.isArray(response.data) ? response.data[0] : response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params,
                    type: 'landing'
                })

                console.log(response)
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)

                commit('flashes/add', {
                    title: 'Page enregistrée',
                    type: 'success'
                }, { root: true })
                
                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Échec de l'enregistrement`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'landing' }
                })

                if (response.errors.length > 0) throw response.errors
                
                commit('deleteOne', _id)
                
                return response
            } catch (e) {
                console.error(e)
                return e
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

            return items.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}