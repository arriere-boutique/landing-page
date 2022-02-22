<template>
    <div class="Layout LayoutDefault" :class="[`is-${color}`, classes ]">
        <header-banner />
        <header-base />
        
        <div class="LayoutDefault_content">
            <Nuxt />

            <footer-base />
        </div>

        <tooltip-manager />
        <flashes-manager />
        <popin-manager />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutDefault',
    components: { TooltipManager },
    computed: {
        color () { return this.$store.state.page.body.color },
        classes () { return this.$store.state.page.body.classes }
    },
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e);
        }
        
        if (process.server) return
        window.addEventListener('beforeinstallprompt', e => e.preventDefault())
    },
    beforeDestroy() {
       this.$recaptcha.destroy()
    }
}
</script>