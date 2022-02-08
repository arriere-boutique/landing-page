export default {
    state: () => ({
        domain: '',
        subdomain: ''
    }),
    mutations: {
        setSubdomain (state, data) {
            state.subdomain = data
        },
        setDomain (state, data) {
            state.domain = data
        },
    },
    actions: {
        nuxtServerInit ({ commit }, context) {
            let breakup = context.req.headers.host.match(/^(\w+(-\w+)?)\.(localhost|\w+(-\w+)?)(\.\w+)?/)
            
            if (breakup && breakup[0]) commit('setDomain', breakup[0])
            if (breakup && breakup[1]) commit('setSubdomain', breakup[1])
        }
    }
}