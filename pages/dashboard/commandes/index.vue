<template>
    <div>
        <div class="Wrapper Wrapper--left Wrapper--s pb-100">
            <p class="ft-2xl-bold mv-40">Mes commandes</p>

            <div class="Page_cols">
                <div class="fx-grow">
                    <template v-if="isLoading">
                        <p class="ft-xl-medium mb-10">
                            <span class="Tag Tag--xs is-sunset mr-5"><i class="fal fa-spinner-third spin fa-sm"></i></span> Commandes
                        </p>

                        <div class="row-s">
                            <div class="col-12 col-12@m mv-10" v-for="i in 5" :key="i">
                                <placeholder :modifiers="['h', 'xs', 'simple']" class="br-m" />
                            </div>
                        </div>
                    </template>
                    
                    <div class="Tile is-emerald text-center ft-l-medium" v-if="pendingOrders.length == 0 && preparedOrders.length == 0 && !isLoading">
                        <div class="vehicle mb-15">
                            <i class="fal fa-truck"></i>
                        </div>
                        Toutes les commandes ont été traitées, bravo !
                    </div>

                    <template v-if="pendingOrders.length > 0 && !isLoading">
                        <p class="ft-xl-medium mb-10"><span class="Tag Tag--xs is-sunset mr-5">{{ pendingOrders.length }}</span> Commandes à préparer</p>

                        <div class="row-s">
                            <div class="col-12 col-12@m mv-10" v-for="order in pendingOrders" :key="order._id">
                                <order-block v-bind="order" @click.native="selectedOrderId = order._id" @action="onAction" />
                            </div>
                        </div>

                        <hr class="Separator mv-40" />
                    </template>

                    <template v-if="preparedOrders.length > 0 && !isLoading">

                        <p class="ft-xl-medium mb-10"><span class="Tag Tag--xs is-ice mr-5">{{ preparedOrders.length }}</span> Commandes préparées</p>

                        <div class="row-s">
                            <div class="col-12 col-12@m mv-10" v-for="order in preparedOrders" :key="order._id">
                                <order-block v-bind="order" @click.native="selectedOrderId = order._id" @action="onAction" />
                            </div>
                        </div>

                        <hr class="Separator mv-40" />
                    </template>
                    
                    <template v-if="completedOrders.length > 0 && !isLoading">
                        <div class="fx-center mb-40">
                            <p class="ft-xl-medium"><span class="Tag Tag--xs is-emerald mr-5">{{ completedOrders.length }}</span> Commandes envoyées</p>

                            <!-- <button-base :modifiers="['round', 's', 'light', 'border']" :icon-before="displayCompleted ? 'angle-up' : 'angle-down'" @click="displayCompleted = !displayCompleted" /> -->
                        </div>

                        <transition-group name="fade" is="div" v-if="displayCompleted">
                            <div class="mb-60" v-for="date in displayedCompletedOrders" :key="date">
                                <div class="d-flex fxa-center mb-10">
                                    <div class="Tag Tag--s mr-10">
                                        {{ $moment(date).fromNow() }}
                                    </div>

                                    <p class="ft-s-medium">Envoyées le {{ $moment(date).format('D MMMM YYYY') }}</p>

                                    <hr class="Separator fx-grow ml-20">
                                </div>

                                <div class="row-xs">
                                    <div class="col-6 col-12@m mv-5" v-for="order in ordersByDate[date]" :key="order._id">
                                        <order-block v-bind="order" @click.native="selectedOrderId = order._id" @action="onAction" />
                                    </div>
                                </div>
                            </div>

                            <div key="loader">
                                <button-base :modifiers="['secondary', 's']" icon-before="long-arrow-down" @click="completedLimit += 10" v-if="completedLimit < Object.keys(this.ordersByDate).length">
                                    Afficher les commandes suivantes
                                </button-base>
                            </div>
                        </transition-group>
                    </template>
                </div>
            </div>
        </div>

        <popin-base :modifiers="['panel', 'absolute-header']" :is-active="selectedOrderId ? true : false" @close="onClose">
            <template slot="content">
                <order-body
                    class="p-40 p-20@s"
                    :id="selectedOrderId"
                    @change="onOrderChange"
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
        this.shops.forEach(async shop => {
            await this.$store.dispatch('shop/sync', {
                notification: false,
                params: { id: shop._id, syncItems: [ 'orders' ] }
            })
        })
        
        await this.$store.dispatch('shop-orders/fetch', { owner: '$self' })

        this.isLoading = false
    },
    fetchOnServer: false,
    data: () => ({
        isLoading: true,
        displayCompleted: true,
        completedLimit: 10,
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
        },
        displayedCompletedOrders () {
            return Object.keys(this.ordersByDate).sort((a, b) => b - a).slice(0, this.completedLimit)
        },
        ordersByDate () {
            return this.completedOrders.reduce((t, o) => {
                let key = this.$moment.unix(o.shippedDate).format('MM-DD-YYYY')
                return {
                    ...t,
                    [key]: t[key] ? [ ...t[key], o] : [o]
                }
            }, {})
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
        },
        onOrderChange (v) {
            this.selectedOrderId = false
            setTimeout(() => this.selectedOrderId = v, 200)
        }
    }
}
</script>