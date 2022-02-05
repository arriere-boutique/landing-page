import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({}),
    actions: { 
        async get ({}, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query,
                    type: 'shop'
                }))
   
                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
    }
}