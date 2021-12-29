<template>
    <div class="Layout LayoutDefault LayoutDefault--shop" :class="[`is-${color}`, classes ]">
        <header-shop />
        
        <div class="LayoutDefault_content">
            <Nuxt />

            <footer-base :is-shop="true" />
        </div>

        <cart-nav :is-active="isCartActive" />
        
        <tooltip-manager />
    </div>
</template>

<script>
import { TooltipManager } from '@instant-coffee/core'

export default {
    name: 'LayoutDefault',
    components: { TooltipManager },
    computed: {
        color () { return this.$store.state.page.body.color },
        isCartActive () { return this.$store.state.page.isCartActive },
        classes () { return this.$store.state.page.body.classes }
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