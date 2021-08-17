export default {
    namespaced: true,
    state: () => ({
        body: {
            classes: []
        },
        meta: {
            title: ''
        }    
    }),
    mutations: {
        addClasses (state, classes) {
            state.body.classes = [ ...state.body.classes, ...classes]
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