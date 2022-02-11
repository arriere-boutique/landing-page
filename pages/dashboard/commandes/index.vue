<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">
            <p class="ft-2xl-bold mv-40">Mes commandes</p>

            <div class="Page_cols">
                <div class="fx-grow">
                    <p class="ft-xl-medium mb-10"><span class="round bg-sunset-xweak mr-5">{{ pendingOrders.length }}</span> Commandes à préparer</p>

                    <div class="row-s">
                        <div class="col-12 col-12@m mv-10" v-for="order in pendingOrders" :key="order._id">
                            <order-block class="max-width-l" v-bind="order" @click.native="selectedOrderId = order._id" @action="onAction" />
                        </div>
                    </div>

                    <template v-if="preparedOrders.length > 0">
                        <hr class="Separator mv-40" />

                        <p class="ft-xl-medium mb-10"><span class="round bg-ice-xweak mr-5">{{ preparedOrders.length }}</span> Commandes préparées</p>

                        <div class="row-s">
                            <div class="col-12 col-12@m mv-10" v-for="order in preparedOrders" :key="order._id">
                                <order-block class="max-width-l" v-bind="order" @click.native="selectedOrderId = order._id" @action="onAction" />
                            </div>
                        </div>
                    </template>
                    
                    <template v-if="completedOrders.length > 0">
                        <hr class="Separator mv-40" />

                        <p class="ft-xl-medium mb-10"><span class="round bg-emerald-xweak mr-5">{{ completedOrders.length }}</span> Commandes envoyées</p>

                        <div class="row-s">
                            <div class="col-12 col-12@m mv-10" v-for="order in completedOrders" :key="order._id">
                                <order-block class="max-width-l" v-bind="order" @click.native="selectedOrderId = order._id" @action="onAction" />
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <popin-base :modifiers="['panel', 'absolute-header']" :is-active="selectedOrderId ? true : false" @close="onClose">
            <template slot="content">
                <order-body
                    class="p-40"
                    :id="selectedOrderId"
                    v-if="selectedOrderId"
                />
            </template>
        </popin-base>
    </div>
</template>

<script>
export default {
    name: 'DashboardOrders',
    middleware: 'loggedUserAndShop',
    layout: 'dashboard',
    async fetch () {
        this.shops.forEach(shop => {
            this.$store.dispatch('shop/sync', {
                notification: false,
                params: { id: shop._id, syncItems: [ 'orders' ] }
            })
        })
        
        this.$store.dispatch('shop-orders/fetch', { owner: '$self' })
    },
    fetchOnServer: false,
    data: () => ({
        selectedOrderId: '',
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        orders () {
            // let orders = this.shops.reduce((total, current) => [ ...total, ...current.orders.map(o => ({ ...o, shop: current })) ], [])
            // return orders.sort((a, b) => b.orderDate.valueOf() - a.orderDate.valueOf())

            return this.$store.getters['shop-orders/items']
        },
        pendingOrders () {
            return this.orders.filter(o => o.listings.length > o.prepared.length && o.status == 'Paid').sort((a, b) => b.orderDate - a.orderDate)
        },
        preparedOrders () {
            return this.orders.filter(o => o.listings.length == o.prepared.length && o.status != 'Completed').sort((a, b) => b.orderDate - a.orderDate)
        },
        completedOrders () {
            return this.orders.filter(o => o.status == 'Completed').sort((a, b) => b.orderDate - a.orderDate)
        }
    },
    methods: {
        onAction (action) {
            if (action == 'add-tracking') {
                this.addNewTracking = true
            }
        },
        onClose () {
            this.selectedOrderId = false
        }
    }
}
</script>