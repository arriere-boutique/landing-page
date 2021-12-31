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
    async fetch () {
        try {
            await this.$store.dispatch('products/fetch')
            await this.$store.dispatch('order/recover')
        } catch (e) {
            console.error(e)
        }
    },
    computed: {
        color () { return this.$store.state.page.body.color },
        isCartActive () { return this.$store.state.page.isCartActive },
        classes () { return this.$store.state.page.body.classes },
        user () { return this.$store.state.auth.user },
        order () { return this.$store.getters['order/get'] },
    },
    watch: {
        cart: {
            immediate: true,
            handler (v) {
                console.log('order : ' + (v ? v.id : 'null'))
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
        await this.$recaptcha.init()
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>