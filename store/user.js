import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        guestId: null
    }),
    mutations: {
        update (state, user) {
            if (user && user.role == 'guest') state.guestId = user._id
        } 
    },
    actions: {
        async logOut ({ state }) {
            try {
                const response = await this.$auth.loginWith('local', { 
                    data: { _id: state.guestId ? state.guestId : undefined, type: 'guest' }
                })
    
                if (response.data.status != 1) throw Error('error')
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async createGuest ({ state }) {
            try {
                const response = await this.$auth.loginWith('local', { 
                    data: { _id: state.guestId ? state.guestId : undefined, type: 'guest' }
                })
    
                if (response.data.status != 1) throw Error('error')
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetch ({ commit }) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    type: 'user'
                }))
                
                return response
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async update ({ commit, rootState }, params) {
            try {
                const response = await this.$axios.$post('/entities', {
                    _id: rootState.auth.user._id,
                    ...params,
                    type: 'user'
                })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                this.$auth.fetchUser()
    
                return response
            } catch (e) {
                console.error(e)
                return null
            }
        }
    }
}