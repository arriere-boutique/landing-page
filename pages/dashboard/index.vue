<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-3xl-bold mv-40">Bonjour {{ user.name }} ! <i class="ml-5 fal fa-sparkles"></i></p>

            <div class="Grid">
                <div class="cell-width-8">
                    <div class="Tile fx-align-end bg-gum-xweak">
                        <div>
                            <i class="fal fa-xl fa-sparkles"></i>

                            <p class="ft-xl-bold mv-15">
                                Seuls ceux qui prendront le risque d'aller trop loin découvriront jusqu'où on peut aller.
                            </p>

                            <p class="ft-hand-2xs">thomas Stearns eliot</p>
                        </div>
                    </div>
                </div>
                <div class="cell-width-4 cell-height-2">
                    <div class="Tile bg-gum-xweak">

                    </div>
                </div>
                <div class="cell-width-4">
                    <div class="Tile fx-dir-column fx-justify-between bg-emerald-xweak">
                        <div>
                            <i class="fal fa-lg fa-coin"></i>

                            <p class="ft-xl-bold">Chiffre d'affaire</p>
                            <p class="ft-s-medium text-uppercase">30 derniers jours</p>
                        </div>

                        <p class="ft-4xl-bold mt-20">
                            {{ getTotalProfit()|round }}<span class="ft-xl-bold">€</span>
                        </p>
                    </div>
                </div>
                <div class="cell-width-4">
                    <div class="Tile fx-dir-column fx-justify-between bg-precious-xweak">
                        <div>
                            <i class="fal fa-lg fa-box"></i>

                            <p class="ft-xl-bold">Commandes</p>
                            <p class="ft-s-medium text-uppercase">30 derniers jours</p>
                        </div>

                        <p class="ft-5xl-bold mt-20">
                            {{ getOrderCount() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
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
        orders () { return this.$store.getters['shop/allOrders'] }
    },
    methods: {
        getOrderCount (limit = 30, unit = 'days') {
            let selected = this.orders.filter(o => this.$moment().diff(this.$moment.unix(o.orderDate), unit) <= limit)
            return selected.length
        },
        getTotalProfit (limit = 30, unit = 'days') {
            let selected = this.orders.filter(o => this.$moment().diff(this.$moment.unix(o.orderDate), unit) <= limit)
            return selected.reduce((total, order) => total += order.total.amount, 0) / 100
        }, 
    }
}
</script>

<style lang="scss" scoped>
</style>