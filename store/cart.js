export default {
    namespaced: true,
    state: () => ({
        items: []
    }),
    mutations: {
        recover (state) {
            if (this.$cookies.get('cart')) {
                state.items = this.$cookies.get('cart')
            }
        },
        save (state) {
            console.log('save cookie')
            console.log(state.items)
            
            this.$cookies.set('cart', state.items, {
                maxAge: 60 * 60 * 24 * 90
            })
        },
        update (state, items) {
            state.items = items
            this.commit('cart/save')
        },
        addItem (state, item) {
            let existing = state.items.find(i => i.id == item.id && i.variationId == item.variationId)

            if (existing) {
                state.items = state.items.map(i => (i.id == item.id && i.variationId == item.variationId ? {
                    ...i,
                    quantity: i.quantity + item.quantity
                } : i))
            } else {
                state.items = [ ...state.items, item ]
            }

            this.commit('page/toggleCart')
            this.commit('cart/save')
        }
    },
    actions: {
        async checkout ({ state, getters }) {
            try {
                let cart = getters['get']

                const response = await this.$axios.$post('/checkout', {
                    shipping: cart.hasShipping,
                    items: cart.items
                })
                
                if (response.errors.length > 0) throw response.errors

                window.location.href = response.data.url
                
                return true
            } catch (e) {
                console.error(e)
                return e
            }
        }
    },
    getters: {
        get: (state, getters, rootState, rootGetters) => {
            let hasShipping = false
            let items = state.items.map(item => {
                let product = rootGetters['products/findOne']({ _id: item.id })
                let variation = product.variations.find(variation => variation._id == item.variationId)

                if (variation && !variation.digital) hasShipping = true

                return {
                    ...item,
                    ...product,
                    variation,
                    price: variation.price
                }
            })

            let total = items.reduce((total, item) => {
                return total + (item.variation.price * item.quantity)
            }, 0)

            return {
                ...state,
                hasShipping,
                total: Math.round(total * 100) / 100,
                items
            }
        }
    }
}