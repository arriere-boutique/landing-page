import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        loaded: false,
        info: {
            name: '',
            image: '',
            theme: {
                color: 'amethyst',
                icon: 'cat-space'
            }
        }
    }),
    mutations: {
        preview (state, params) {
            state.info = {
                ...state.info,
                ...params
            }
        }
    },
    actions: {
        async fetch ({ commit }) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    type: 'user'
                }))
                
                return response
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async update ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params,
                    type: 'user'
                })
                
                if (response.errors.length > 0) throw response.errors

                this.$auth.fetchUser()
    
                return response
            } catch (e) {
                console.error(e)
                return e
            }
        }
    }
}