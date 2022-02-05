<template>
    <div>
        <div class="Wrapper pv-60">
            <p class="ft-2xl-bold">Hey {{ user.name }} ! <i class="fal fa-sparkles"></i></p> {{ user.email }}

            <div v-if="token || user.etsyToken">
                Boutique connectée
                <button-base @click="syncShop">Mettre à jour ma boutique</button-base>

                <button-base @click="connectShop">Reconnecter ma boutique</button-base>
            </div>
            <div v-else>
                <button-base @click="connectShop">Connecter ma boutique</button-base>
            </div>

            <div v-if="listings">
                <div v-for="listing in listings" class="d-flex fx-align-center p-10 mv-5" :key="listing.listing_id">
                    <div>
                        <img :src="listing.images[0].url_75x75" v-if="listing.images && listing.images[0]">
                    </div>
                    <div class="ph-15 width-s ellipsis-3">{{ listing.title }}</div>
                    <div class="ph-15">{{ listing.num_favorers }}</div>
                    <div class="ph-15">{{ (listing.price.amount / listing.price.divisor) }}€</div>
                </div>
            </div>

            <div class="mv-40">
                <div class="bg-bg-light mv-10 p-15" v-for="order in orders" :key="order._id">
                    <div class="row-no-gutters">
                        <div class="col-4">{{ order.id }}</div>

                        <div class="col-4">{{ order.items.length }} article(s)</div>

                        <div class="col-4 text-right">{{ $moment(order.createdAt).fromNow() }}</div>
                    </div>

                    <div v-for="(item, i) in getItems(order.items)" :key="i">
                        <img :src="item.thumbnail" width="50"> {{ item.title }} <span v-if="item.activeVariation">{{ item.activeVariation.title }}</span>
                    </div>
                </div>
            </div>

            <button-base tag="nuxt-link" :modifiers="['link']" :attrs="{ to: localePath({ name: 'compte-logout' }) }">
                Se déconnecter
            </button-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AccountPage',
    middleware: 'loggedUser',
    layout: 'shop',
    async fetch () {
        this.orders = await this.$store.dispatch('order/fetch', {
            query: { completed: true, owner: this.user._id }
        })
    },
    data: () => ({
        token: null,
        orders: []
    }),
    computed: {  
        user () { return this.$store.state.auth.user },
        listings () { return this.$store.state.shop.data.listings }
    },
    async mounted () {
        this.token = this.$route.query.token

        if (this.token) {
            this.$store.dispatch('user/update', {
                params: {
                    etsyId: this.token.split('.')[0],
                    etsyToken: this.token
                }
            })
        }
    },
    methods: {
        getItems (items) {
            return items.map(id => this.$store.getters['products/productFromVariation'](id))
        },
        async connectShop () {
            let response = await this.$store.dispatch('shop/auth')
            if (response) window.location = response
        },
        async syncShop () {
            let response = await this.$store.dispatch('shop/syncInfo')
        }
    }
}
</script>

<style>

</style>