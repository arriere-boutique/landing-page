<template>
    <div>
        <div class="d-flex mv-20" v-for="(item, i) in local.cart.items" :key="i">
            <div class="col-3">
                <div class="CartBody_image" :style="{ backgroundImage: `url(${item.cover})` }"></div>
            </div>
            <div class="fx-grow pl-10">
                <p class="ft-m-bold ellipsis-1">{{ item.title }}</p>
                <p class="color-ft-weak ft-italic">{{ item.variation.title }}</p>

                <div class="d-flex fx-align-center fx-justify-between mt-15">
                    <input-base class="InputBase--s width-3xs" :helpers="['number']" type="number" v-model="item.quantity" />
                    <p class="ft-m ml-5">{{ Math.round((item.price * item.quantity) * 100) / 100 }}€</p>
                </div>
            </div>
        </div>

        <div class="ft-s mv-20 bg-gum-xweak ph-15 pv-5" v-for="(item, i) in deletedItems" :key="i">
            <span class="ft-bold">"{{ item.title }}"</span> supprimé du panier. <button-base :modifiers="['link']" @click="addItem(item)">Annuler</button-base>
         </div>
    </div>
</template>

<script>
import { InputBase } from '@instant-coffee/core'

export default {
    name: 'CartBody',
    components: { InputBase },
    data: () => ({
        state: {
            updated: false
        },
        deletedItems: [],
        local: {
            cart: {
                items: []
            }
        }
    }),
    computed: {
        cart () {
            return this.$store.getters['cart/get']
        },
        cartRaw () {
            return this.$store.state.cart
        }
    },
    watch: {
        cart: {
            deep: true,
            handler (v) {
                this.local.cart = v
            }
        },
        ['local.cart.items']: {
            deep: true,
            handler (v) {
                let updated = false
                let deleted = v.filter(item => item.quantity < 1)

                if (deleted.length > 0) this.deletedItems = deleted
                let items = v.filter(item => item.quantity >= 1).map(item => {
                    let found = this.cartRaw.items.find(i => i.id == item.id && i.variationId == item.variationId && i.quantity == item.quantity)

                    if (!found) updated = true

                    return {
                        id: item.id,
                        variationId: item.variationId,
                        quantity: item.quantity
                    }
                })

                if (updated || items.length != this.cartRaw.items.length) this.$store.commit('cart/update', items)
            }
        }
    },
    mounted () {
        this.local.cart = this.cart
    },
    methods: {
        addItem (item) {
            this.deletedItems = []
            this.local.cart.items.push({ ...item, quantity: 1 })
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