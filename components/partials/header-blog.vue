<template>
    <header class="HeaderBase HeaderBase--blog is-gum" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper Wrapper Wrapper--l">
            <div class="HeaderBase_left">
                <a class="HeaderBase_logo fx-center" :href="$blogUrl">
                    <icon-base name="logo/logo-main" :height="state.isScrolled ? 35 : 45" />

                    <span class="Tag Tag--s ml-10">Le blog</span>
                </a>
            </div>

            <div class="HeaderBase_right">
                <nav class="HeaderBase_nav">
                    <div v-for="(item, i) in showingItems" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="i">
                        <component  class="HeaderBase_navLink" :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href">
                            {{ item.label }}
                        </component>
                    </div>
                </nav>

                <a :href="$dashboardUrl" class="HeaderBase_button ml-20" v-if="user && user.role != 'guest'">
                    <i class="fal fa-store"></i>
                </a>
            </div>

            <div class="HeaderBase_burger" @click="state.isMenu = true">
                <i class="fa-thin fa-bars"></i>
            </div>

            <div class="HeaderBase_menu" :class="{ 'is-active': state.isMenu }">
                <div class="HeaderBase_navParent" v-for="(item, i) in showingItems" :key="i">
                    <component
                        class="HeaderBase_navLink"
                        :is="item.path ? 'nuxt-link' : 'a'"
                        :to="localePath(item.path)"
                        :href="item.href"
                    >
                        {{ item.label }}
                    </component>
                </div>

                <div class="HeaderBase_close" @click="state.isMenu = false">
                    <i class="fa-thin fa-times"></i>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderBlog',
    data: () => ({
        scroll: process.client ? window.pageYOffset : 0,
        items: [],
        state: {
            isScrolled: false,
            isMenu: false
        }
    }),
    watch: {
        '$route' () {
            this.$data.state.isMenu = false
        },
        scroll: {
            immediate: true,
            handler (v) {
                this.$data.state.isScrolled = v > 0
            }
        }
    },
    computed: {  
        user () { return this.$store.state.auth.user },
        showingItems () { return this.items.filter(i => !i.isHidden) }
    },
    mounted () {
        this.$data.items = [
            { label: 'Articles & astuces', path: { name: 'articles' } },
            { label: `Outils pratiques`, path: { name: 'outils-pratiques-etsy' } },
            { label: `Crée ton Arrière Boutique`, href: this.$baseUrl, isHidden: this.user && this.user.role != 'guest' }
        ]

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>