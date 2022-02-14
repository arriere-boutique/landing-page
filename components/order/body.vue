<template>
    <div>
        <div class="mb-30">
            <p class="ft-2xl-bold ft-xl-bold@s">
                Commande n°{{ order.id }}

                <span class="ft-m ml-5 d-block@s ml-0@s">du {{ $moment.unix(order.orderDate).format('D MMMM YYYY') }}</span>
            </p>

            <nav-bar v-model="section" :items="navItems" ref="nav" />
        </div>

        <transition-group
            class="NavContent"
            tag="div"
            :name="`fade-${panAnimation}`"
            :class="{ 'is-reset': panReset }"
            :style="{ '--pos-x': `${pan}px` }"
            v-hammer:pan.horizontal="onPan"
            v-hammer:panend.horizontal="onPanEnd"
            ref="container"
        >
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
        hammer: null,
        pan: 0,
        panReset: false,
        panAnimation: 'left'
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
    watch: {
        pan (v) {
            if (!v) {
                this.panReset = true
                setTimeout(() => {
                    this.panReset = false
                }, 150)
            }
        }
    },
    methods: {
        onPan (v) {
            let max = this.$refs.container.$el.offsetWidth
            let force = Math.max(1 - (Math.abs(v.deltaX * 0.25) / max), 0)

            this.pan += v.velocityX * force
        },
        onPanEnd (v) {
            this.pan = 0

            if (v.deltaX <= -200) {
                this.$refs.nav.next()
                this.panAnimation = 'right'
            } else if (v.deltaX >= 200) {
                this.$refs.nav.prev()
                this.panAnimation = 'left'
            }
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

    .NavContent {
        transform: translateX(var(--pos-x));
        touch-action: pan-y !important;

        &.is-reset {
            transition: all 150ms ease-out;
        }
    }
</style>