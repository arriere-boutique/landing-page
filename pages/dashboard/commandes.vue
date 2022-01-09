<template>
    <div>
        <div class="Wrapper ">
            <div class="bg-emerald-xweak br-m mb-40">
                <div class="p-40">
                    <p class="ft-2xl-bold">Mes commandes</p>
                </div>
            </div>

            <div class="p-10" v-for="order in orders" :key="order._id">
                {{ order.name }} {{ $moment.unix(order.orderDate).fromNow() }} 

                <div>
                    <img :src="order.shop.logo" width="20"> {{ order.shop.name }}
                </div>

                <div class="p-10 bg-pond-xweak">
                    <div class="d-flex" v-for="(listing, i) in order.listings" :key="i">
                        <p class="ellipsis-1 mh-20 fx-grow">{{ listing.title }}</p>
                        <p class="fx-no-shrink mh-20">x {{ listing.quantity }}</p>
                        <p class="fx-no-shrink">{{ listing.price.amount / listing.price.divisor }}€</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardOrders',
    middleware: 'loggedUser',
    layout: 'dashboard',
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        orders () {
            let orders = this.shops.reduce((total, current) => [ ...total, ...current.orders.map(o => ({ ...o, shop: current })) ], [])
            return orders.sort((a, b) => b.orderDate.valueOf() - a.orderDate.valueOf())
        }
    },
    methods: {}
}
</script>

<style>

</style>