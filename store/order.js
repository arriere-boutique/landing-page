export default {
    namespaced: true,
    state: () => ({
        orderId: null
    }),
    mutations: {
        setId (state, id) {
            state.orderId = id
        }
    },
    actions: {
        async update ({ commit, rootGetters }, params) {
            try {
                let cart = rootGetters['cart/get']
                let items = cart.items.reduce((total, current) => {
                    for (let i = 0; i < current.quantity; i++) {
                        total.push(current.variationId)
                    }

                    return total
                }, [])

                const response = await this.$axios.$post('/order', {
                    items, ...params
                })
                
                if (response.errors.length > 0) throw response.errors

                commit('setId', response.data.id)

                return response.data
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async checkout ({ state }) {
            try {
                const response = await this.$axios.$post('/order/checkout', {
                    id: state.orderId
                })
                
                if (response.errors.length > 0) throw response.errors
                
                return response.data
            } catch (e) {
                console.error(e)
                return e
            }
        }
    }
}