export default function ({ store, redirect }) {
    if (!store.state.auth.user || store.state.auth.user.role == 'guest') {
        return redirect('/compte/login')
    }

    if (store.state.auth.user.shops.length <= 0) {
        return redirect('/')
    }
}