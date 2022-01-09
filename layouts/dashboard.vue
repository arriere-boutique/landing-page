<template>
    <div class="Layout LayoutDashboard" :class="[ classes ]">
        <nav-dashboard />

        <div class="LayoutDashboard_content">
            <header-dashboard />
            
            <Nuxt />
        </div>

        <tooltip-manager />
    </div>
</template>

<script>
import { TooltipManager } from '@instant-coffee/core'

export default {
    name: 'LayoutDashboard',
    components: { TooltipManager },
    async fetch () {
        try {
            await this.$store.dispatch('shop/fetch')
        } catch (e) {
            console.error(e)
        }
    },
    computed: {
        classes () { return this.$store.state.page.body.classes }
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