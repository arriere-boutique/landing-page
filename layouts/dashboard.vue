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
        
        <transition name="down">
            <banner-base class="is-sunset" v-show="shops.length == 0 && !$route.name.includes('parametres')">
                Pour profiter de ton Arrière Boutique, connecte ta boutique Etsy en deux clics !

                <template slot="actions">
                    <button-base :modifiers="['secondary', 'xs', 'light']"  tag="nuxt-link" :attrs="{ to: localePath({ name: 'parametres' }) }">
                        Connecter
                    </button-base>
                </template>
            </banner-base>
        </transition>
        
        <transition name="down">
            <banner-base id="install-pwa" class="is-ice" v-show="prompt">
                Retrouve ton Arrière Boutique plus facilement sur ton portable

                <template slot="actions">
                    <button-base :modifiers="['secondary', 'xs', 'light']" @click="promptPWA">
                        Installer en un clic
                    </button-base>

                    <div class="p-10 ml-5" @click="prompt = null">
                        <i class="fal fa-times"></i>
                    </div>
                </template>
            </banner-base>
        </transition>

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
        onWindowResize: null,
        prompt: null
    }),
    computed: {
        shops () { return this.$store.state.shop.items },
        user () { return this.$store.state.auth.user },
        hasSub () { return this.$store.state.user.hasSubscription },
        classes () { return this.$store.state.page.body.classes },
        isCompact () { return this.$store.state.page.isNavCompact },
        isPWA () { return this.$store.state.page.isPWA }
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

        this.$store.commit('page/setMode', window.matchMedia('(display-mode: standalone)').matches)

        if (this.$smallerThan('s')) {
            window.addEventListener('beforeinstallprompt', this.storePWA)
        } else {
            window.addEventListener('beforeinstallprompt', e => e.preventDefault())
        }
    },
    beforeDestroy() {
        this.$recaptcha.destroy()

        window.removeEventListener('beforeinstallprompt', this.storePWA)
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {
        windowResize () {
            this.$store.commit('page/setBreakpoint', window.innerWidth)
        },
        storePWA (e) {
            e.preventDefault()
            this.prompt = e
        },
        promptPWA () {
            this.prompt.prompt()
            this.prompt = null
        }
    }
}
</script>