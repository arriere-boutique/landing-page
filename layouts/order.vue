<template>
    <div class="Layout LayoutOrder" :class="[ classes ]">
        <div class="LayoutOrder_wrapper Wrapper">
            <div class="LayoutOrder_left">
                <nuxt-link class="HeaderBase_logo mb-40" :to="localePath({ name: 'shop' })">
                    <icon-base name="logo/logo-main" class="fill-pond" :height="50" />
                </nuxt-link>

                <cart-body :editable="false" />

                <div v-if="order">
                    <hr class="Separator mv-20">

                    <div class="d-flex fx-align-center fx-justify-between" v-show="order.items.length > 0">
                        <p class="ft-s color-ft-weak line-1">Sous-total</p>
                        <p class="ft-m line-1">{{ order.price.total }}€</p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-between mt-10" v-show="order.items.length > 0">
                        <p class="ft-s color-ft-weak line-1">Livraison</p>
                        <p class="ft-m line-1">0.00€</p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-between mt-20" v-show="order.items.length > 0">
                        <p class="ft-s color-ft-weak line-1">Au total :</p>
                        <p class="ft-2xl-medium line-1">{{ order.price.total }}€</p>
                    </div>
                </div>
            </div>

            <div class="LayoutOrder_right pt-40">
                <Nuxt />
            </div>
        </div>

        <tooltip-manager />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutOrder',
    components: { TooltipManager },
    async fetch () {
        try {
            await this.$store.dispatch('products/fetch')
            await this.$store.dispatch('order/recover')
        } catch (e) {
            console.error(e)
        }
    },
    computed: {
        classes () { return this.$store.state.page.body.classes },
        order () { return this.$store.getters['order/get'] },
        user () { return this.$store.state.auth.user }
    },
    watch: {
        order: {
            immediate: true,
            handler (v) {
                if (v) console.log('order : ' + (v ? v.id : 'null') + ' (' + v.owner + ')')
            }
        },
        user: {
            immediate: true,
            handler (v) {
                this.$store.commit('user/update', v)
            }
        }
    },
    async mounted () {
        if (!this.order) this.$router.push({ path: this.localePath({ name: 'shop' }) })

        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e)
        }
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>