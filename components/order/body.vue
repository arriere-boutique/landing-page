<template>
    <div>
        <nav-body class="p-40 p-20@s" :items="navItems" :value="defaultActive" v-if="order">
            <p class="ft-2xl-bold ft-xl-bold@s">
                Commande n°{{ order.id }}

                <span class="ft-m ml-5 d-block@s ml-0@s">du {{ $moment.unix(order.orderDate).format('D MMMM YYYY') }}</span>
            </p>
        </nav-body>
    </div>
</template>

<script>

export default {
    name: 'OrderBody',
    props: {
        id: { type: String, default: '' }
    },
    data: () => ({

    }),
    computed: {
        order () { return this.$store.getters['shop-orders/findOne']({ _id: this.id }) },
        otherOrders () {
            return this.$store.getters['shop-orders/find']({ userId: this.order.userId }).sort((a, b) => b.orderDate - a.orderDate)
        },
        isDigital () {
            return this.order.listings.filter(c => c.digital).length == this.order.listings.length
        },
        defaultActive () {
            let defaultId = false

            if (this.order.status == 'Completed' || this.order.prepared.length == this.order.listings.length) defaultId = 'delivery'
            
            if (this.order.shipments.length > 0 || this.isDigital) defaultId = 'client'

            return defaultId
        },
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'order-preparation',
                    label: 'Préparation',
                    props: { order: this.order },
                    checked: this.order.status == 'Completed' || this.order.prepared.length == this.order.listings.length
                }, {
                    id: 'delivery',
                    component: 'order-delivery',
                    label: 'Livraison',
                    props: { order: this.order },
                    checked: this.order.shipments.length > 0,
                    disabled: this.isDigital
                }, {
                    id: 'client',
                    component: 'order-client',
                    label: 'Fidélisation',
                    props: { order: this.order },
                },
                // { id: 'profit', label: 'Profit', isActive: this.section == 'profit', onClick: () => this.section = 'profit' },
            ]
        }
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