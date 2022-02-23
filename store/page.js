const BREAKPOINTS = [
    { id: 'xs', size: 0 },
    { id: 's', size: 600 },
    { id: 'm', size: 900 },
    { id: 'l', size: 1200 },
]

export default {
    namespaced: true,
    state: () => ({
        isCartActive: false,
        isNavCompact: false,
        isBodyOverflow: true,
        isPWA: false,
        breakpoint: "",
        body: {
            classes: [ 'is-fill' ],
            color: ''
        },
        meta: {
            title: ''
        }    
    }),
    mutations: {
        setMode (state, v) {
            state.isPWA = v
        },
        setBreakpoint (state, v) {
            state.breakpoint = BREAKPOINTS.reduce((r, b) => {
                return v > b.size ? b.id : r
            }, 'l')
        },
        toggleOverflow (state, v) {
            if (!state.isBodyOverflow || v === true) {
                state.isBodyOverflow = true
            } else if (state.isBodyOverflow) {
                state.isBodyOverflow = false 
            }
            
            document.body.classList.toggle('o-hidden', !state.isBodyOverflow)
        },
        toggleCompact (state, params) {
            state.isNavCompact = params.force !== undefined ? params.force : !state.isNavCompact
            if (params.save) this.$cookies.set('nav-compact', JSON.stringify(state.isNavCompact))
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
    },
    getters: {
        smallerThan: (state) => (v) => {
            return state.breakpoint ? BREAKPOINTS.find(b => b.id == v).size >= BREAKPOINTS.find(b => b.id == state.breakpoint).size : false
        },
        biggerThan: (state) => (v) => {
            return state.breakpoint ? BREAKPOINTS.find(b => b.id == v).size < BREAKPOINTS.find(b => b.id == state.breakpoint).size : false
        }
    }
}