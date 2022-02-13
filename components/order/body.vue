<template>
    <div>
        <div class="mb-30">
            <p class="ft-2xl-bold ft-xl-bold@s">
                Commande n°{{ order.id }}

                <span class="ft-m ml-5 d-block@s ml-0@s">du {{ $moment.unix(order.orderDate).format('D MMMM YYYY') }}</span>
            </p>

            <nav-bar v-model="section" :items="navItems" />
        </div>

        <transition-group name="fade">
            <component v-for="sect in navItems"
                :is="`order-${sect.id}`"
                :order="order"
                :key="sect.id"
                v-show="section == sect.id"
            />
        </transition-group>

    </div>
</template>

<script>
export default {
    name: 'OrderBody',
    props: {
        id: { type: String, default: '' }
    },
    data: () => ({
        section: 'preparation',
    }),
    computed: {
        order () { return this.$store.getters['shop-orders/findOne']({ _id: this.id }) },
        otherOrders () {
            return this.$store.getters['shop-orders/find']({ userId: this.order.userId }).sort((a, b) => b.orderDate - a.orderDate)
        },
        isDigital () {
            return this.order.listings.filter(c => c.digital).length == this.order.listings.length
        },
        navItems () {
            return [
                {
                    id: 'preparation',
                    label: 'Préparation',
                    checked: this.order.status == 'Completed' || this.order.prepared.length == this.order.listings.length
                }, {
                    id: 'delivery',
                    label: 'Livraison',
                    checked: this.order.shipments.length > 0,
                    disabled: this.isDigital
                }, {
                    id: 'client',
                    label: 'Fidélisation'
                },
                // { id: 'profit', label: 'Profit', isActive: this.section == 'profit', onClick: () => this.section = 'profit' },
            ]
        }
    },
    methods: {

    }
}
</script>

<style lang="scss">
    .Order_section {

        & + & {
            margin-top: 20px;
        }
    }
</style>