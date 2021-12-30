<template>
    <div>
        <div class="Wrapper pv-60">
            <p class="ft-2xl-bold">Hey {{ user.name }} ! <i class="fal fa-sparkles"></i></p>

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
            query: { owner: this.user._id }
        })
    },
    data: () => ({
        orders: []
    }),
    computed: {  
        user () { return this.$store.state.auth.user }
    },
    methods: {
        getItems (items) {
            return items.map(id => this.$store.getters['products/productFromVariation'](id))
        }
    }
}
</script>

<style>

</style>