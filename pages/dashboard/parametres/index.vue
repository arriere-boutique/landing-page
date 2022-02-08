<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">

            <p class="ft-2xl-bold mt-40">Mes paramètres</p>

            <nav-bar class="mb-40" :items="navItems" />

            <div class="p-relative">
                <transition name="fade">
                    <parametres-index :shops="shops" :user="user" v-show="section == 'index'" />
                </transition>

                <transition name="fade">
                    <parametres-domains :shops="shops" :user="user" v-show="section == 'domains'" />
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardParams',
    middleware: 'loggedUser',
    layout: 'dashboard',
    data: () => ({ 
        section: 'index',
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        navItems () {
            return [
                { label: 'Général', isActive: this.section == 'index', onClick: () => this.section = 'index' },
                { label: 'Mes liens', isActive: this.section == 'domains', onClick: () => this.section = 'domains' },
                { label: 'Paramètres', isActive: this.section == 'config', onClick: () => this.section = 'config' },
            ]
        }
    }
}
</script>

<style lang="scss" scoped> 
</style>