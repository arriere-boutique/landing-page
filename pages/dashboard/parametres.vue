<template>
    <div>
        <div class="Wrapper">
            <div class="bg-ice-xweak br-m mb-40">
                <div class="p-40">
                    <p class="ft-2xl-bold">Mes paramètres</p>
                </div>
            </div>
            <p class="ft-xl-bold">Boutiques connectées</p>

            <div class="row-xs mt-10" v-if="shops">
                <div class="col-4 pv-10" v-for="shop in shops" :key="shop._id">
                    <shop-block v-bind="shop" :is-syncing="shopsSyncing.includes(shop._id)" @sync="syncShop(shop._id)" />
                </div>
                <div class="col-4 pv-10 d-flex">
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
        shopsSyncing: []
    }),
    async mounted () {
        this.token = this.$route.query.token

        if (this.token) {
            let shop = await this.$store.dispatch('shop/create', {
                etsyId: this.token.split('.')[0],
                etsyToken: this.token,
                etsyRefresh: this.$route.query.refresh
            })

            this.$auth.fetchUser()
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
        }
    }
}
</script>

<style>

</style>