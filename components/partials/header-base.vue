<template>
    <header class="HeaderBase" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper Wrapper Wrapper--l">
            <nuxt-link :to="localePath({ name: '/' })">
                <icon-base
                    class="HeaderBase_logo"
                    name="logo/logo-main"
                    :width="state.isScrolled ? 65 : 85"
                />
            </nuxt-link>

            <nav class="HeaderBase_nav">
                <div class="HeaderBase_navParent" v-for="(item, key) in items" :key="key">
                    <component :is="item.path ? 'nuxt-link' : 'a'" :to="localePath({ name: item.path })" :href="item.href" class="HeaderBase_navLink" :target="item.href ? '_blank' : ''">
                        {{ item.label }}
                    </component>
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
            articles: { label: 'Articles', path: 'blog' },
            youtube: { label: 'La chaîne Youtube', href: 'https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg' },
            about: { label: 'Qui suis-je ?', path: 'about-me' },
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