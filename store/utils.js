import shortid from "shortid"

export default {
    namespaced: true,
    state: () => ({
        flashbag: [],
        confirmPopin: null,
        window: {
            scroll: true
        }
    }),
    mutations: {
        addFlash (state, value) {
            state.flashbag.push({
                id: shortid.generate(),
                text: value.type == 'error' ? 'Une erreur est survenue.' : 'Succès !',
                icon: value.type == 'error' ? 'dizzy' : 'check',
                ...value
            })
        },
        endFlash (state, id) {
            let flashbag = state.flashbag.slice()
            state.flashbag = flashbag.filter(n => n.id !== id)
        },
        confirm (state, params) {
            state.confirmPopin = { ...params }
        },
        closeConfirm (state) {
            state.confirmPopin = null
        },
        toggleScroll (state, value) {
            state.window.scroll = value
        }
    }
}