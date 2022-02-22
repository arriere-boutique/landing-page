<template>
    <div class="Layout LayoutBlog" :class="[`is-${color}`, classes ]">
        <header-banner />
        <header-blog />
        
        <div class="LayoutBlog_content">
            <Nuxt />

            <footer-blog />
        </div>

        <tooltip-manager />
        <flashes-manager />
        <popin-manager />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutBlog',
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