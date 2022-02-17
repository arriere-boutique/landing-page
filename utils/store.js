export default {
    getCollection (items) {
        return Object.keys(items).map(key => items[key])
    },
    getQuery (path, query) {
        return query ? `${path}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}` : path
    },
    updateOne (state, value) {
        let items = JSON.parse(JSON.stringify(state.items))
        items[value._id] = value

        return items
    },
    deleteOne (state, id) {
        let items = JSON.parse(JSON.stringify(state.items))
        delete items[id]

        return items
    },
    refresh (values) {
        let items = values.reduce((acc, value) => {
            return { ...acc, [value._id]: value }
        }, {})

        return items
    },
    handleErrors: (e, commit, text, parent) => {
        let message = e.message
        let errorText = message
        
        e = Array.isArray(e) ? e : [ e ]

        if (message && parent && `errors.default['${message}']` !== parent.$i18n.t(`errors.default['${message}']`)) errorText = parent.$i18n.t(`errors.default['${message}']`)

        e.forEach(e => {
            commit('flashes/add', {
                title: text,
                text: errorText
            }, { root: true })

            console.error(e)
        })

        return { status: 0, code: message, error: errorText }
    }
}