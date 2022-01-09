<template>
    <div>
        <div class="Wrapper ">
            <div class="bg-emerald-xweak br-m mb-40">
                <div class="p-40">
                    <p class="ft-2xl-bold">Mes commandes</p>
                </div>
            </div>

            <p class="ft-xl mb-10"><b>Commandes en cours</b> ({{ pendingOrders.length }})</p>

            <div class="p-10" v-for="order in pendingOrders" :key="order._id">
                <order-block v-bind="order" />
            </div>

            <hr class="Separator mv-60" />

            <p class="ft-xl mb-10"><b>Commandes complétées</b> ({{ completedOrders.length }})</p>

            <div class="p-10" v-for="order in completedOrders" :key="order._id">
                <order-block v-bind="order" />
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
        },
        pendingOrders () {
            return this.orders.filter(o => o.status == 'Paid')
        },
        completedOrders () {
            return this.orders.filter(o => o.status == 'Completed')
        }
    },
    methods: {}
}
</script>

<style>

</style>