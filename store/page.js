export default {
    namespaced: true,
    state: () => ({
        body: {
            classes: [],
            color: 'gum'
        },
        meta: {
            title: ''
        }    
    }),
    mutations: {
        setColor (state, color) {
            state.body = { ...state.body, color }
        },
        setClasses (state, classes) {
            state.body.classes = classes
        },
        setProperty (state, params) {
            state.meta = {
                ...state.meta,
                ...params,
                title: params.secondary ? params.secondary : params.title
            }
        }
    }
}