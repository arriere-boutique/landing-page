<template>
    <div>
        <p class="ft-xl-medium"><span class="round bg-pond-xweak mr-5">{{ shops.length }}</span> Boutiques connectées</p>

        <div class="row-xs mt-10" v-if="shops">
            <div class="col-4 pv-10 col-12@s" v-for="shop in shops" :key="shop._id">
                <shop-block v-bind="shop" :is-syncing="shopsSyncing.includes(shop._id)" @sync="syncShop(shop._id)" @delete="promptDelete(shop._id)" />
            </div>

            <div class="col-4 pv-10 col-12@s" v-if="token">
                <placeholder class="br-m" text="Ajout en cours..." />
            </div>

            <div class="col-4 pv-10 d-flex col-12@s" :style="{ minHeight: '325px' }" v-if="!token">
                <div class="text-center height-100 d-flex width-100 fx-justify-center br-m fx-align-center bg-ice-xweak">
                    <div>
                        <button-base icon-before="plus" :class="{ 'is-disabled': shops.length >= 2 }" :modifiers="['ice']" @click="connectShop">Connecter une boutique</button-base>

                        <p class="ft-s-medium mt-15" v-if="shops.length >= 1">Le multi-boutique n'est pas encore disponible.</p>
                    </div>
                </div>
            </div>
        </div>

        <p class="ft-xl-medium mt-40">Mon compte</p>

        <div class="fx-center bg-bg-xweak p-20 mt-20 br-m d-block@s">
            <p>Connecté sous {{ user.email }}</p>
            <link-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'compte-logout' }) }">Se déconnecter</link-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ParametresIndex',
    props: {
        shops: { type: Array, default: () => [] },
        user: { type: Object, default: () => ({}) }
    },
    data: () => ({
        token: null,
        shopsSyncing: []
    }),
    async mounted () {
        this.token = this.$route.query.token

        if (this.token) {
            try {
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
            } catch (e) {
                this.token = false
            }
        }
    },
    methods: {
        async connectShop () {
            let response = await this.$store.dispatch('shop/auth')
            if (response) window.location = response
        },
        async syncShop (id) {
            this.shopsSyncing.push(id)

            await this.$store.dispatch('shop/sync', {
                params: { id, syncItems: [ 'info', 'listings', 'orders', 'listing-photos', 'reviews'] }
            })

            this.shopsSyncing = this.shopsSyncing.filter(s => s._id == id)
        },
        promptDelete (id) {
            this.$store.commit('popin/open', {
                title: `Si tu déconnectes ta boutique, tu n'auras plus accès à certaines fonctionnalités de ton Arrière Boutique.`,
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