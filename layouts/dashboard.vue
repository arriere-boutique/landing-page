<template>
    <div class="Layout LayoutDashboard" :class="[ ...classes, { 'is-compact': isCompact } ]">
        <nav-dashboard :is-active="isNavActive" @toggle="isNavActive = !isNavActive" />

        <div class="LayoutDashboard_content">
            <header-dashboard @toggle="isNavActive = !isNavActive" :is-active="isNavActive" />
            
            <Nuxt />
        </div>

        <popin-base :is-active="false" :modifiers="['absolute-header', 'l']">
            <template slot="content">
                <div class="p-40">
                    <subscriptions />
                </div>
            </template>
        </popin-base>

        <tooltip-manager />
        <flashes-manager />
        <popin-manager />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutDashboard',
    components: { TooltipManager },
    async fetch () {
        try {
            if (this.user && this.user.role != 'guest') await this.$store.dispatch('shop/fetch')
        } catch (e) {
            console.error(e)
        }
    },
    data: () => ({
        isNavActive: false
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        classes () { return this.$store.state.page.body.classes },
        isCompact () { return this.$store.state.page.isNavCompact }
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