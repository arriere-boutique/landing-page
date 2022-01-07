import storeUtils from '@/utils/store'
import { generateCodes } from '@/utils/etsy'
import moment from 'moment'

export default {
    namespaced: true,
    state: () => ({
        stateId: null,
        data: {
            user: null,
            shop: null,
            listings: null
        }
    }),
    mutations: {
        setStateId (state, id) {
            state.stateId = id
        },
        updateData (state, data) {
            state.data = data
        }
    },
    actions: { 
        async ping () {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/etsy/ping'))
                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async auth ({ commit, state }) {
            try {
                const codes = generateCodes()
                commit('setStateId', codes.state)

                const response = await this.$axios.$post('/entities', {
                    params: {
                        id: state.stateId,
                        value: codes.codeVerifier,
                        type: 'oauth'
                    },
                    type: 'token'
                })
                
                if (response.errors.length > 0) throw response.errors

                return storeUtils.getQuery('https://www.etsy.com/oauth/connect', {
                    response_type: 'code',
                    redirect_uri: 'http://localhost:3000/api/oauth/redirect',
                    scope: ['shops_r', 'shops_w', 'listings_r', 'listings_w', 'address_r', 'billing_r', 'email_r', 'profile_r', 'profile_w'].join('%20'),
                    client_id: 'p7yi9v1ughgg9uy0d39tljzr',
                    state: state.stateId,
                    code_challenge: codes.codeChallenge,
                    code_challenge_method: 'S256'
                })
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async syncInfo ({ commit, rootState }) {
            try {
                if (!rootState.auth.user) throw 'no-user'

                const response = await this.$axios.$post('/etsy/sync')

                if (response.status != 0) commit('updateData', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        }
    }
}