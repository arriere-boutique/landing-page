<template>
    <header class="HeaderBase" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper Wrapper Wrapper--l">
            <nuxt-link :to="localePath({ name: '/' })">
                <icon-base
                    class="HeaderBase_logo fill-amber"
                    name="logo/logo-main"
                    :width="state.isScrolled ? 65 : 85"
                />
            </nuxt-link>

            <nav class="HeaderBase_nav">
                <div class="HeaderBase_navParent" v-for="(item, key) in items" :key="key">
                    <a class="HeaderBase_navLink" :href="item.href">{{ item.label }}</a>
                </div>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderBase',
    data: () => ({
        scroll: process.client ? window.pageYOffset : 0,
        items: {
            articles: { label: 'Articles', href: '' },
            youtube: { label: 'La chaîne Youtube', href: 'https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg' },
            about: { label: 'Qui suis-je ?', href: '' },
        },
        state: {
            isScrolled: false
        }
    }),
    watch: {
        scroll: {
            immediate: true,
            handler (v) {
                this.$data.state.isScrolled = v > 0
            }
        }
    },
    mounted () {
        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>