import storeUtils from '@/utils/store'
import { generateCodes } from '@/utils/etsy'
import moment from 'moment'

export default {
    namespaced: true,
    state: () => ({
        stateId: null,
        items: [],
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
        setShops (state, data) {
            state.items = data
        },
        updateShop(state, data) {
            state.items = state.items.map(shop => shop._id == data._id ? data : shop)
        }
    },
    actions: { 
        async fetch ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    owner: '$self',
                    type: 'shop',
                }))
                
                if (response.errors.length > 0) throw response.errors

                commit('setShops', response.data)

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la récupération des données de boutique')
            }
        },
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
                    scope: ['shops_r', 'shops_w', 'listings_r', 'listings_w', 'address_r', 'billing_r', 'email_r', 'profile_r', 'profile_w', 'transactions_r', 'transactions_w'].join('%20'),
                    client_id: 'p7yi9v1ughgg9uy0d39tljzr',
                    state: state.stateId,
                    code_challenge: codes.codeChallenge,
                    code_challenge_method: 'S256'
                })
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la connection de la boutique')
            }
        },
        async sync ({ commit, dispatch }, id) {
            try {
                const response = await this.$axios.$post('/etsy/sync', { id })

                if (response.status == 0) throw response.errors

                commit('flashes/add', {
                    title: response.data.name + ' synchronisée',
                    type: 'success'
                }, { root: true })

                dispatch('fetch')

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec de la synchronisation')
            }
        },
        async create ({ commit, dispatch }, params) {
            try {
                const response = await this.$axios.$post('/etsy/link', {
                    ...params
                })
                
                if (response.status == 0) throw response.errors

                commit('flashes/add', {
                    title: `Mission réussie, ta boutique ${response.data.name} a correctement été ajoutée !`,
                    type: 'success'
                }, { root: true })

                dispatch('fetch')

                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la connection de la boutique')
            }
        },
        async delete ({ commit, dispatch }, id) {
            try {
                const response = await this.$axios.$post('/etsy/unlink', { id })
                
                if (response.status == 0) throw response.errors

                commit('flashes/add', {
                    title: 'Mission réussie, ta boutique est déconnectée.',
                    type: 'success'
                }, { root: true })

                dispatch('fetch')

                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Échec lors de la suppression de la boutique')
            }
        } 
    },
    getters: {
        allOrders: (state) => {
            return state.items.reduce((total, current) => [ ...total, ...current.orders ], [])
        },
        allListings: (state) => {
            return state.items.reduce((total, current) => [ ...total, ...current.listings ], [])
        },
        listingById: (state, getters) => (id) => {
            let item = getters.allListings.find(l => l._id == id)
            return item
        }
    }
}