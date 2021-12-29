<template>
    <div class="Layout LayoutOrder" :class="[ classes ]">
        <div class="LayoutOrder_wrapper Wrapper">
            <div class="LayoutOrder_left">
                <nuxt-link class="HeaderBase_logo mb-40" :to="localePath({ name: 'shop' })">
                    <icon-base name="logo/logo-main" class="fill-pond" :height="50" />
                </nuxt-link>

                <cart-body :editable="false" />

                <div>
                    <hr class="Separator mv-20">

                    <div class="d-flex fx-align-center fx-justify-between" v-show="cart.items.length > 0">
                        <p class="ft-s color-ft-weak line-1">Sous-total</p>
                        <p class="ft-m line-1">{{ cart.total }}€</p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-between mt-10" v-show="cart.items.length > 0">
                        <p class="ft-s color-ft-weak line-1">Livraison</p>
                        <p class="ft-m line-1">0.00€</p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-between mt-20" v-show="cart.items.length > 0">
                        <p class="ft-s color-ft-weak line-1">Au total :</p>
                        <p class="ft-2xl-medium line-1">{{ cart.total }}€</p>
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
import { TooltipManager } from '@instant-coffee/core'

export default {
    name: 'LayoutOrder',
    components: { TooltipManager },
    computed: {
        classes () { return this.$store.state.page.body.classes },
        cart () { return this.$store.getters['cart/get'] }
    },
    async mounted () {
        try {
            await this.$recaptcha.init()
            await this.$store.dispatch('products/fetch')

            this.$store.commit('cart/recover')
        } catch (e) {
            console.error(e);
        }
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>