export default {
    state: () => ({
        subdomain: ''
    }),
    mutations: {
        setSubdomain (state, data) {
            state.subdomain = data
        }
    },
    actions: {
        nuxtServerInit ({ commit }, context) {
            let breakup = context.req.headers.host.match(/^(\w+(-\w+)?)\.(localhost|\w+(-\w+)?)(\.\w+)?/)

            console.log(context.req.headers.host)
            console.log(breakup)

            if (breakup && breakup[1]) commit('setSubdomain', breakup[1])
        }
    }
}