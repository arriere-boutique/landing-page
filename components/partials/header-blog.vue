<template>
    <header class="HeaderBase HeaderBase--blog" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper Wrapper Wrapper--l">
            <div class="HeaderBase_left">
                <nuxt-link class="HeaderBase_logo" :to="localePath({ name: 'blog' })">
                    <icon-base name="logo/logo-main" :height="state.isScrolled ? 35 : 45" />

                    <span class="ft-m-bold color-current ml-5">Le blog</span>
                </nuxt-link>
            </div>

            <div class="HeaderBase_right">
                <nav class="HeaderBase_nav">
                    <div v-for="(item, key) in itemsLeft" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                        <component  class="HeaderBase_navLink" :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                            {{ item.label }}
                        </component>
                    </div>
                </nav>

                <div v-for="(item, key) in itemsRight" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                    <component  class="HeaderBase_navLink" :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                        {{ item.label }}
                    </component>
                </div>
                
                <a :href="localePath({ name: 'admin' })" class="HeaderBase_button mr-5" v-if="user && user.role == 'admin'">
                    <i class="fal fa-crown"></i>
                </a>

                <a :href="localePath({ name: 'admin' })" class="HeaderBase_button mr-5" v-if="user && user.role != 'guest'">
                    <i class="fal fa-user"></i>
                </a>

                <a :href="$baseUrl" class="HeaderBase_button mr-5">
                    <i class="fal fa-home"></i>
                </a>
            </div>

            <div class="HeaderBase_burger" @click="state.isMenu = true">
                <i class="fa-thin fa-bars"></i>
            </div>

            <div class="HeaderBase_menu" :class="{ 'is-active': state.isMenu }">
                <div class="HeaderBase_navParent" v-for="(item, key) in { ...itemsLeft, ...itemsRight }" :key="key">
                    <component
                        class="HeaderBase_navLink"
                        :is="item.path ? 'nuxt-link' : 'a'"
                        :to="localePath(item.path)"
                        :href="item.href"
                        :target="item.href ? '_blank' : ''"
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
        itemsLeft: [],
        itemsRight: [],
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
        user () { return this.$store.state.auth.user }
    },
    mounted () {
        this.$data.itemsLeft = {
            articles: { label: 'Articles & astuces', path: { name: 'articles' } },
            about: { label: `Qui suis-je ?`, path: { name: 'moi-moi-moi' } },
        }

        this.$data.itemsRight = {
            // shop: { label: `La boutique`, path: { name: 'shop' } }
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>