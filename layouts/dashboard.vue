<template>
    <div class="Layout LayoutDashboard" :class="[ ...classes, { 'is-compact': isCompact } ]">
        <nav-dashboard
            :is-active="isNavActive"
            @toggle="isNavActive = !isNavActive"
        />

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
import Debounce from 'lodash.debounce'

export default {
    name: 'LayoutDashboard',
    components: { TooltipManager },
    async fetch () {
        try {
            if (this.user && this.user.role != 'guest') {
                await this.$store.dispatch('shop/fetch')
                await this.$store.dispatch('user/getSubscription')
            }
        } catch (e) {
            console.error(e)
        }
    },
    data: () => ({
        isNavActive: false,
        onWindowResize: null
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        hasSub () { return this.$store.state.user.hasSubscription },
        classes () { return this.$store.state.page.body.classes },
        isCompact () { return this.$store.state.page.isNavCompact }
    },
    async mounted () {
        try {
            await this.$recaptcha.init()
        } catch (e) {
            console.error(e)
        }

        if (process.server) return

        this.windowResize()

        this.onWindowResize = Debounce(this.windowResize, 500)
        window.addEventListener('resize', this.onWindowResize)
    },
    beforeDestroy() {
        this.$recaptcha.destroy()
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {
        windowResize () {
            this.$store.commit('page/setBreakpoint', window.innerWidth)
        }
    }
}
</script>