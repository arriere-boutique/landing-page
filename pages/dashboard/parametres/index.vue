<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">
            
            <nav-body :items="navItems">
                <p class="ft-2xl-bold mt-40">Mes paramètres</p>
            </nav-body>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardParams',
    middleware: 'loggedUser',
    layout: 'dashboard',
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'parametres-index',
                    label: 'Général'
                }, {
                    id: 'domains',
                    component: 'parametres-domains',
                    label: 'Mes liens'
                }, {
                    id: 'subscriptions',
                    component: 'parametres-subscriptions',
                    label: 'Mon abonnement'
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped> 
</style>