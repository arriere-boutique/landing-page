import storeUtils from '@/utils/store'
import moment from 'moment'

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
        async fetch ({ commit }, params) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'page'
                }))

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async get ({ commit }, _id) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    _id, type: 'page'
                }))
                
                commit('updateOne', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async create ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params,
                    type: 'page'
                })
                
                if (response.errors.length > 0) throw response.errors

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'page' }
                })

                commit('utils/addFlash', {
                    type: response.status == 1 ? 'success' : 'error'
                }, { root: true })
                
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
                let thumbnail = ''
                let cover = ''
            
                if (item.image) {
                    if (item.image.medias.find(m => m.size == 's')) thumbnail = item.image.medias.find(m => m.size == 's').src
                    if (item.image.medias.find(m => m.size == 'm')) cover = item.image.medias.find(m => m.size == 'm').src
                }

                return {
                    ...item,
                    thumbnail, cover
                }
            })
        },
        find: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}