export default {
    namespaced: true,
    state: () => ({
        data: {
            title: '',
            text: '',
            actions: []
        },
        active: false
    }),
    mutations: {
        open (state, data) {
            state.active = true
            
            if (data.cancellable !== false) {
                data.actions = [ {
                    label: 'Annuler',
                    $cancel: true
                }, ...(data.actions ? data.actions : [])]
            }

            state.data = data
        },
        close (state) {
            state.active = false
        },
        reset (state) {
            state.data = {
                actions: []
            }
        }
    }
}