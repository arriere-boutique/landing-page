<template>
    <div
        class="LayoutAdmin"
        :class="[ ...pageClasses, { 'is-scroll-layout': scroll > 20, 'is-scroll-disabled': disableScroll } ]"
    >
        <header-admin class="LayoutAdmin_header" />

        <nav-admin
            class="LayoutAdmin_nav"
        />

        <div class="LayoutAdmin_body">
            <div class="LayoutAdmin_background">
                <div class="LayoutAdmin_title">
                    {{ title }}
                </div>
            </div>
            
            <div class="LayoutAdmin_content">
                <Nuxt />
            </div>
        </div>

        <tooltip-manager />
        <flashbag />
        <popin-confirm />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutAdmin',
    components: { TooltipManager },
    middleware: 'admin',
    data: () => ({
        scroll: 0
    }),
    computed: {
        user () { return this.$store.state.user.info },
        savedUser () { return this.$store.state.auth.user },
        title () { return this.$store.state.page.meta.title },
        disableScroll () { return !this.$store.state.utils.window.scroll },
        pageClasses () { return this.$store.state.page.body.classes }
    },
    watch: {
        savedUser: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$store.commit('user/preview', v)
            }
        },
        disableScroll: {
            immediate: true,
            handler (v) {
                if (process.client) document.body.classList.toggle('is-scroll-disabled', v)
            }
        }
    },
    mounted () {
        this.$data.scroll = window.scrollY
        window.addEventListener('scroll', () => this.$data.scroll = window.scrollY)
    }
}
</script>