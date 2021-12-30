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
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'product',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })
                
                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'product'
                }))
   
                commit('updateOne', Array.isArray(response.data) ? response.data[0] : response.data)

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
                    type: 'product'
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
                    params: { _id, type: 'product' }
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

                if (item.medias) {
                    if (item.medias.medias.find(m => m.size == 's')) thumbnail = item.medias.medias.find(m => m.size == 's').src
                    if (item.medias.medias.find(m => m.size == 'm')) cover = item.medias.medias.find(m => m.size == 'm').src
                }

                return {
                    ...item,
                    thumbnail, cover,
                    createdAt: moment(item.createdAt),
                    updatedAt: moment(item.updatedAt),
                    variations: item.variations.map(variation => ({
                        ...variation,
                        price: variation.price / 100
                    }))
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

            return items.sort((a, b) => a.price - b.price)
        },
        groupBy: (state, getters) => (property) => {
            let items = getters.items

            items = items.reduce((obj, item) => {
                let newObj = { ...obj }

                if (!newObj[item[property]]) {
                    newObj[item[property]] = [ item ]
                } else {
                    newObj[item[property]].push(item)
                }

                return newObj
            }, {})

            return items
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        },
        productFromVariation: (state, getters) => (id) => {
            let activeVariation = null
            let foundProduct = getters.items.find(product => {
                let found = false
                
                product.variations.forEach(variation => {
                    if (variation._id == id) {
                        activeVariation = variation
                        found = true
                    }
                })

                return found
            })
            
            foundProduct = { ...foundProduct, activeVariation }

            return foundProduct
        }
    }
}