<template>
    <div v-if="local.order && local.order.items">
        <div class="d-flex mb-20" v-for="(item, i) in local.order.items" :key="i + Math.random()">
            <div class="col-3">
                <div class="CartBody_image" :style="{ backgroundImage: `url(${item.cover})` }"></div>
            </div>
            <div class="fx-grow pl-20">
                <p class="ft-m-bold ellipsis-1">{{ item.title }}</p>
                <p class="color-ft-weak ft-italic">{{ item.activeVariation.title }}</p>

                <div class="d-flex fx-align-center fx-justify-between mt-15">
                    <input-base class="InputBase--s width-3xs" :helpers="['number']" type="number" v-model="item.quantity" v-if="editable" />
                    <p class="ft-italic color-ft-weak" v-else>{{ item.activeVariation.price }}€ x {{ item.quantity }}</p>
                    <p class="ft-m ml-5">{{ Math.round((item.activeVariation.price * item.quantity) * 100) / 100 }}€</p>
                </div>
            </div>
        </div>

        <div class="ft-s mv-20 bg-gum-xweak ph-15 pv-5" v-for="(item, i) in deletedItems" :key="i">
            <span class="ft-bold">"{{ item.title }}"</span> supprimé du panier. <button-base :modifiers="['link']" @click="addItem(item)">Annuler</button-base>
         </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'CartBody',
    components: { InputBase },
    props: {
        editable: { type: Boolean, default: true }
    },
    data: () => ({
        state: {
            updated: false,
            loading: false
        },
        deletedItems: [],
        local: { order: null }
    }),
    computed: {
        order () { return this.$store.getters['order/get'] },
        orderRaw () { return this.$store.state.order.order }
    },
    watch: {
        order: {
            deep: true,
            handler (v) {
                this.local.order = v
            }
        },
        ['local.order.items']: {
            deep: true,
            async handler (v) {
                this.state.loading = true
                
                let deleted = v.filter(item => item.quantity < 1)

                if (deleted.length > 0) this.deletedItems = deleted

                let items = v.filter(item => item.quantity >= 1).map(item => ({
                    _id: item.activeVariation._id,
                    quantity: item.quantity
                }))
                
                if (items.reduce((total, i) => total + i.quantity, 0) != this.orderRaw.items.length) await this.$store.dispatch('order/updateItems', items)

                this.state.loading = false
            }
        }
    },
    mounted () {
        this.local.order = this.order
    },
    methods: {
        addItem (item) {
            this.deletedItems = []
            this.local.order.items.push({ ...item, quantity: 1 })
        }
    }
}
</script>

<style lang="scss" scoped>
    .CartBody_image {
        background-position: center;
        background-size: cover;
        border-radius: 4px;

        &::before {
            content: '';
            display: block;
            padding-bottom: 100%;
        }
    }
</style>