import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        guestId: null
    }),
    mutations: {
        update (state, user) {
            if (user && user.role == 'guest') state.guestId = user._id
            
            console.log('current : ' + user._id + ` (${user.role})`)
            console.log('guest : ' + state.guestId)
        } 
    },
    actions: {
        async logOut ({ state }) {
            try {
                const response = await this.$auth.loginWith('local', { 
                    data: { _id: state.guestId ? state.guestId : undefined, type: 'guest' }
                })
    
                if (response.data.status != 1) throw 'error'
            } catch (e) {
                console.error(e)
                return e
            }
        },
        async createGuest ({ state }) {
            try {
                const response = await this.$auth.loginWith('local', { 
                    data: { _id: state.guestId ? state.guestId : undefined, type: 'guest' }
                })
    
                if (response.data.status != 1) throw 'error'
            } catch (e) {
                console.error(e)
                return e
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