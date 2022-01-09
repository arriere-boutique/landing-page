<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-3xl-bold mv-40">Bonjour {{ user.name }} ! <i class="ml-5 fal fa-sparkles"></i></p>

            <div class="Grid">
                <div class="one">
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
                <div class="two">
                    <div class="Tile bg-gum-xweak">

                    </div>
                </div>
                <div class="three">
                    <div class="Tile fx-dir-column fx-justify-between bg-emerald-xweak">
                        <div>
                            <i class="fal fa-lg fa-coin"></i>

                            <p class="ft-xl-bold">Profit estimé</p>
                            <p class="ft-s-medium text-uppercase">30 derniers jours</p>
                        </div>

                        <p class="ft-4xl-bold">
                            {{ getTotalProfit() }}<span class="ft-xl-bold">€</span>
                        </p>
                    </div>
                </div>
                <div class="four">
                    <div class="Tile fx-dir-column fx-justify-between bg-precious-xweak">
                        <div>
                            <i class="fal fa-lg fa-box"></i>

                            <p class="ft-xl-bold">Commandes</p>
                            <p class="ft-s-medium text-uppercase">30 derniers jours</p>
                        </div>

                        <p class="ft-5xl-bold">
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
    .Grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-gap: 30px;
        grid-auto-rows: minmax(200px, auto);
    }

    .Tile {
        border-radius: 10px;
        height: 100%;
        display: flex;
        padding: 20px;
    }

    .one {
        grid-column: auto / span 8;
        grid-row: 1;
    }

    .two {
        grid-column: auto / span 4;
        grid-row: 1 / 3;
    }

    .three {
        grid-column: auto / span 5;
        grid-row: 2;
    }

    .four {
        grid-column: auto / span 3;
        grid-row: 2;
    }
</style>