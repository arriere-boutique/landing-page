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
                
                if (response.errors.length > 0) throw response.errors

                commit('updateOrder', response.data[0] ? response.data[0] : null)

                return response.data[0] ? response.data[0] : null
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async update ({ commit, fetch, rootGetters }, params = {}) {
            try {
                const response = await this.$axios.$post('/order', params)
                
                if (response.errors.length > 0) throw response.errors

                commit('updateOrder', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async checkout ({ state }) {
            try {
                const response = await this.$axios.$post('/order/checkout', {
                    id: state.order._id
                })
                
                if (response.errors.length > 0) throw response.errors
                
                return response.data
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async fetch ({ state }, params) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'order'
                }))
                
                if (response.errors.length > 0) throw response.errors

                return response.data
            } catch (e) {
                console.error(e)
                return e
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