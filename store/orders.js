import storeUtils from '@/utils/store'
import moment from 'moment'

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    actions: {
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'order'
                }))

                return Array.isArray(response.data) ? response.data[0] : response.data
            } catch (e) {
                console.error(e)
                return null
            }
        }
    }
}