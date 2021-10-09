<template>
    <div class="LayoutDefault LayoutDefault--shop" :class="[`is-${color}`]">
        <header-base />
        
        <div class="LayoutDefault_content">
            <Nuxt />

            <footer-base :is-shop="true" />
        </div>

        <tooltip-manager />
    </div>
</template>

<script>
import { TooltipManager } from '@instant-coffee/core'

export default {
    name: 'LayoutDefault',
    components: { TooltipManager },
    computed: {
        color () { return this.$store.state.page.body.color }
    },
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e);
        }
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>