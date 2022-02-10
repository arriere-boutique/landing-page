import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        order: null
    }),
    mutations: {
        updateOrder (state, order) {
            state.order = order
        }
    },
    actions: {
        async recover ({ commit }) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    owner: '$self',
                    $sort: 'createdAt',
                    $sortValue: -1,
                    $limit: 1,
                    type: 'order'
                }))
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOrder', response.data[0] ? response.data[0] : null)

                return response.data[0] ? response.data[0] : null
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async update ({ commit, fetch, rootGetters }, params = {}) {
            try {
                const response = await this.$axios.$post('/order', params)
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOrder', response.data)

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async checkout ({ state, commit }, params) {
            try {
                const response = await this.$axios.$post('/order/checkout', {
                    id: params.price ? null : state.order._id,
                    price: params.price,
                    type: params.type,
                    metadata: params.metadata
                })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async confirm ({ state, commit }, params) {
            try {
                const response = await this.$axios.$post('/order/confirm', params)
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async fetch ({ state, commit }, params) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'order'
                }))
                
                if (response.status == 0) throw Error(response.errors[0])

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async addItem ({ state }, item) {
            try {
                if (!this.$auth.user) {
                    await this.dispatch('user/createGuest')
                    if (!this.$auth.user) throw Error('user-not-created')
                }

                let items = [ item ].reduce((total, current) => {
                    for (let i = 0; i < current.quantity; i++) {
                        total.push(current._id)
                    }

                    return total
                }, [])

                if (!state.order) {
                    await this.dispatch('order/update', {
                        items: [ ...items ]
                    })
                } else {
                    await this.dispatch('order/update', {
                        _id: state.order._id,
                        items: [ ...state.order.items, ...items ]
                    })
                }
            } catch (e) {
                console.error(e)
            }

            this.commit('page/toggleCart')
        },
        async updateItems ({ state }, items) {
            try {
                items = items.reduce((total, current) => {
                    for (let i = 0; i < current.quantity; i++) {
                        total.push(current._id)
                    }

                    return total
                }, [])

                await this.dispatch('order/update', {
                    _id: state.order._id,
                    items: items
                })
            } catch (e) {
                console.error(e)
            }
        }
    },
    getters: {
        get: (state, getters, rootState, rootGetters) => {
            if (!state.order) return null
            
            let items = state.order.items.reduce((cart, item) => {
                if (!cart[item]) cart[item] = 0
                cart[item] += 1
                return cart
            }, {})

            items = Object.keys(items).map(item => {  
                return {
                    ...rootGetters['products/productFromVariation'](item),
                    quantity: items[item]
                }
            })

            return {
                ...state.order,
                items,
                price: state.order.price ? Object.keys(state.order.price).reduce((price, i) => price = { ...price, [i]: state.order.price[i] / 100 }, {}) : {}
            }
        }
    }
}