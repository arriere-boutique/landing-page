<template>
    <div>
        <div class="Wrapper Wrapper--left pb-40">
            <p class="ft-2xl-bold mv-40">Mes commandes</p>

            <div class="Page_cols">
                <div class="fx-grow">
                    <p class="ft-xl-medium mb-10"><span class="round bg-sunset-xweak mr-5">{{ pendingOrders.length }}</span> Commandes en cours</p>

                    <div class="p-10" v-for="order in pendingOrders" :key="order._id">
                        <order-block v-bind="order" />
                    </div>

                    <hr class="Separator mv-40" />

                    <p class="ft-xl-medium mb-10"><span class="round bg-emerald-xweak mr-5">{{ completedOrders.length }}</span> Commandes complétées</p>

                    <div class="p-10" v-for="order in completedOrders" :key="order._id">
                        <order-block v-bind="order" />
                    </div>
                </div>

                <!-- <div class="Page_side">
                    Hello
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardOrders',
    middleware: 'loggedUser',
    layout: 'dashboard',
    async fetch () {
        this.shops.forEach(shop => {
            this.$store.dispatch('shop/sync', {
                notification: false,
                params: { id: shop._id, syncItems: [ 'orders' ] }
            })
        })
    },
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