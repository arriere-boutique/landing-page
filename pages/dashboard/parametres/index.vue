<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">

            <p class="ft-2xl-bold mt-40">Mes paramètres</p>

            <nav-bar class="mb-40" v-model="section" :items="navItems" />

            <transition-group name="fade">
                <component v-for="sect in navItems"
                    :is="`parametres-${sect.id}`"
                    :shops="shops"
                    :user="user" 
                    :key="sect.id"
                    v-show="section == sect.id"
                />
            </transition-group>
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
    watch: {
        section (v) {
            this.$router.push({ query: { section: v }})
        },
        ['$route.query.section']: {
            immediate: true,
            handler (v) {
                this.section = v ? v : 'index'
            }
        },
    },
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        navItems () {
            return [
                {
                    id: 'index',
                    label: 'Général'
                }, {
                    id: 'domains',
                    label: 'Mes liens'
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped> 
</style>