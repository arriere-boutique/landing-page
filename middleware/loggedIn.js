export default function ({ store, redirect }) {
    if (store.state.auth.user && store.state.auth.user.role != 'guest') {
        return redirect(process.env.dashboardUrl)
    }
}