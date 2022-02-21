<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">
            <p class="Title--l ft-bold mv-40">Bonjour {{ user.name }} ! <i class="ml-5 fal fa-sparkles"></i></p>

            <div class="Grid">
                <div class="cw-8 cw-12@s">
                    <div class="Tile fx-align-end is-gum">
                        <div>
                            <i class="fal fa-xl fa-sparkles"></i>

                            <p class="ft-xl-bold mt-30 mb-10">
                                Seuls ceux qui prendront le risque d'aller trop loin découvriront jusqu'où on peut aller.
                            </p>

                            <p class="Tag n-ml-5">Thomas Stearns Eliot</p>
                        </div>
                    </div>
                </div>
                <div class="cw-4 ch-2 cw-12@s">
                    <div class="Tile bg-gum-xweak">

                    </div>
                </div>
                <div class="cw-4 cw-12@s">
                    <div class="Tile fx-dir-column fx-justify-between is-emerald">
                        <div>
                            <i class="fal fa-lg fa-coin"></i>

                            <p class="ft-xl-bold">Chiffre d'affaire</p>
                            <p class="Tag Tag--s n-ml-5 mt-5">30 derniers jours</p>
                        </div>

                        <p class="ft-4xl-bold mt-30">
                            {{ getTotalProfit()|round }}<span class="ft-xl-bold">€</span>
                        </p>
                    </div>
                </div>
                <div class="cw-4 cw-12@s">
                    <div class="Tile fx-dir-column fx-justify-between is-precious">
                        <div>
                            <i class="fal fa-lg fa-box"></i>

                            <p class="ft-xl-bold">Commandes</p>
                            <p class="Tag Tag--s n-ml-5 mt-5">30 derniers jours</p>
                        </div>

                        <p class="ft-5xl-bold mt-30">
                            {{ getOrderCount() }}
                        </p>
                    </div>
                </div>
                <div class="cw-8 cw-12@s is-duck" v-if="reviews.length > 0">
                    <div class="Tile fx-dir-column fx-justify-between">
                        <div>
                            <div class="Tag Tag--s n-ml-5">
                                <i class="fas fa-star mr-3"></i>
                                <i class="fas fa-star mr-3"></i>
                                <i class="fas fa-star mr-3"></i>
                                <i class="fas fa-star mr-3"></i>
                                <i class="fas fa-star"></i>
                            </div>

                            <p class="ft-m-medium mt-15" v-html="reviews[randomReview].comment"></p>
                        </div>

                        <p class="ft-s-bold mt-20">
                            {{ reviews[randomReview].user.name }}
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
                params: { id: shop._id, syncItems: [ 'listings', 'orders' ] }
            })
        })
    },
    data: () => ({
        randomReview: 0
    }),
    computed: {
        shops () { return this.$store.state.shop.items },
        user () { return this.$store.state.auth.user },
        orders () { return this.$store.getters['shop/allOrders'] },
        reviews () { return this.$store.getters['shop/allReviews'] }
    },
    methods: {
        getOrderCount (limit = 30, unit = 'days') {
            let selected = this.orders.filter(o => this.$moment().diff(this.$moment.unix(o.orderDate), unit) <= limit)
            return selected.length
        },
        getTotalProfit (limit = 30, unit = 'days') {
            let selected = this.orders.filter(o => this.$moment().diff(this.$moment.unix(o.orderDate), unit) <= limit)
            return selected.reduce((total, order) => total += order.total.amount, 0) / 100
        }
    },
    mounted () {
        this.randomReview = this.$randomBetween(0, this.reviews.length - 1)
    }
}
</script>

<style lang="scss" scoped>
</style>