<template>
    <header class="HeaderBase HeaderBase--shop" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper">
            <div class="HeaderBase_button" @click="state.isMenu = true">
                <i class="fal fa-home"></i>
            </div>

            <nuxt-link class="HeaderBase_logo" :to="localePath({ name: '/' })">
                <icon-base name="logo/logo-main" :height="state.isScrolled ? 35 : 45" />
            </nuxt-link>

            <div class="HeaderBase_button" @click="toggleCart">
                <i class="fal fa-shopping-cart"></i>

                {{ cart.items.reduce((p, c) => p + c.quantity, 0) }}
            </div>

            <div class="HeaderBase_burger" @click="state.isMenu = true">
                <i class="fal fa-bars"></i>
            </div>

            <div class="HeaderBase_menu" :class="{ 'is-active': state.isMenu }">
                <div class="HeaderBase_navParent" v-for="(item, key) in categories" :key="key">
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
        <div class="HeaderBase_wrapper HeaderBase_wrapper--secondary">
            <nav class="HeaderBase_nav">
                <div v-for="(item, key) in categories" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                    <component
                        class="HeaderBase_navLink"
                        :class="{ 'color-precious': key == 'sales' }"
                        :is="item.path ? 'nuxt-link' : 'a'"
                        :to="localePath(item.path)"
                        :href="item.href"
                        :target="item.href ? '_blank' : ''"
                    >
                        <i class="HeaderBase_icon fal" :class="[ `fa-${item.icon}` ]"></i>{{ item.label }}
                    </component>
                </div>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderShop',
    data: () => ({
        scroll: process.client ? window.pageYOffset : 0,
        categories: [],
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
                this.$data.state.isScrolled = false
            }
        }
    },
    computed: {
        cart () {
            return this.$store.state.cart
        }
    },
    mounted () {
        this.$data.categories = {
            courses: { label: `Formations`, icon: 'book-heart', path: { name: 'moi-moi-moi' } },
            coaching: { label: `Coachings`, icon: 'comment-smile', path: { name: 'moi-moi-moi' } },
            tools: { label: `Boîte à outils`, icon: 'toolbox', path: { name: 'moi-moi-moi' } },
            sales: { label: `En promo`, icon: 'fire', path: { name: 'moi-moi-moi' } },
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    },
    methods: {
        toggleCart () {
            this.$store.commit('page/toggleCart')
        }
    }
}
</script>