<template>
    <div>
        <div class="Wrapper">
            <div class="bg-ice-xweak br-m mb-40">
                <div class="p-40">
                    <p class="ft-2xl-bold">Mes paramètres</p>
                </div>
            </div>
            <p class="ft-xl-bold">Boutiques connectées ({{ shops.length }})</p>

            <div class="row-xs mt-10" v-if="shops">
                <div class="col-4 pv-10" v-for="shop in shops" :key="shop._id">
                    <shop-block v-bind="shop" :is-syncing="shopsSyncing.includes(shop._id)" @sync="syncShop(shop._id)" @delete="promptDelete(shop._id)" />
                </div>
                <div class="col-4 pv-10" v-if="token">
                    <placeholder class="br-m" text="Ajout en cours..." />
                </div>
                <div class="col-4 pv-10 d-flex" :style="{ minHeight: '325px' }">
                    <div class="text-center height-100 d-flex width-100 fx-justify-center br-m fx-align-center bg-ice-xweak">
                        <button-base icon-before="plus" :modifiers="['ice']" @click="connectShop">Connecter une boutique</button-base>
                    </div>
                </div>
            </div>
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
        shops () { return this.$store.state.shop.items }
    },
    data: () => ({
        token: null,
        shopsSyncing: []
    }),
    async mounted () {
        this.token = this.$route.query.token

        if (this.token) {
            let refresh = this.$route.query.refresh
            let query = Object.assign({}, this.$route.query)
            
            delete query.token
            delete query.refresh

            this.$router.replace({ query })

            await this.$store.dispatch('shop/create', {
                etsyId: this.token.split('.')[0],
                etsyToken: this.token,
                etsyRefresh: refresh
            })

            this.$auth.fetchUser()

            this.token = false
        }
    },
    methods: {
        async connectShop () {
            let response = await this.$store.dispatch('shop/auth')
            if (response) window.location = response
        },
        async syncShop (id) {
            this.shopsSyncing.push(id)

            let response = await this.$store.dispatch('shop/sync', id)

            this.shopsSyncing = this.shopsSyncing.filter(s => s._id == id)
        },
        promptDelete (id) {
            this.$store.commit('popin/open', {
                title: `Déconnecter ta boutique entraîne la suppression des données associées sur ton Arrière Boutique`,
                text: 'Es-tu bien sûr·e de vouloir faire ça ?',
                actions: [
                    { label: 'Déconnecter', color: 'gum', count: 1, action: () => this.deleteShop(id) }
                ]
            })
        },
        async deleteShop (id) {
            let response = await this.$store.dispatch('shop/delete', id)
        }
    }
}
</script>

<style>

</style>