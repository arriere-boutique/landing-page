<template>
    <div>
        <div class="Order_section is-pond bg-current-xweak p-20 br-s" v-if="order.userId">
            <div class="fx-center">
                <div class="ft-m-bold mb-10">
                    <span class="round-s bg-current-weak mr-5">{{ otherOrders.length }}</span>

                    Commandes précédentes
                </div>
            </div>
            
            <div>
                <div class="fx-center bg-bg-light pv-10 ph-15 br-s mv-5" v-for="other in otherOrders" :key="other._id">
                    <div class="ft-s">
                        <component :is="other.id != order.id ? 'link-base' : 'span'" tag="button" @click="$emit('change', other._id)">#{{ other.id }} <i class="fal fa-arrow-up-right ml-3" v-if="other.id != order.id"></i></component>
                        <span class="ft-xs ml-5">
                            {{ $moment.unix(other.orderDate).fromNow() }}
                        </span>
                    </div>
                   
                    <div>
                        <span class="Tag Tag--weak Tag--s mr-5 d-none@xs">{{ other.listings.reduce((t, l) => t += l.quantity, 0) }} articles</span>

                        <span class="ft-medium">{{ (other.total.amount / order.total.divisor)|round }}€</span>
                    </div>
                </div>

                <hr class="Separator mv-20">

                <div class="ft-m-bold text-right">
                    Au total : {{ otherOrders.reduce((t, c) => t += (c.total.amount / c.total.divisor), 0)|round }}€
                </div>
            </div>
        </div>

        <div class="Order_section is-duck bg-current-xweak p-20 br-s" v-if="order.review">
            <div class="d-flex fxa-center">
                <p class="ft-l-bold">
                    Avis laissé par l'acheteur
                </p>
                
                <div class="Tag Tag--s ml-10 is-duck"> 
                    <rating :rating="order.review.rating" />
                </div>
            </div>
            
            <div class="mt-20" v-html="order.review.comment" v-if="order.review.comment"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderClient',
    props: {
        order: { type: Object }
    },
    data: () => ({

    }),
    computed: {
        otherOrders () {
            return this.order.userId ? this.$store.getters['shop-orders/find']({ userId: this.order.userId }).sort((a, b) => b.orderDate - a.orderDate) : []
        }
    },
    methods: {

    }
}
</script>