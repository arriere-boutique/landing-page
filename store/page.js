export default {
    namespaced: true,
    state: () => ({
        isCartActive: false,
        isNavCompact: false,
        isBodyOverflow: true,
        body: {
            classes: [ 'is-fill' ],
            color: 'gum'
        },
        meta: {
            title: ''
        }    
    }),
    mutations: {
        toggleOverflow (state, v) {
            if (!state.isBodyOverflow || v === true) {
                state.isBodyOverflow = true
            } else if (state.isBodyOverflow) {
                state.isBodyOverflow = false 
            }
            
            document.body.classList.toggle('o-hidden', !state.isBodyOverflow)
        },
        toggleCompact (state) {
            state.isNavCompact = !state.isNavCompact
        },
        toggleCart (state) {
            state.isCartActive = !state.isCartActive
        },
        setColor (state, color) {
            state.body = { ...state.body, color }
        },
        setClasses (state, classes) {
            state.body = { ...state.body, classes }
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