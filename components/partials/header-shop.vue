<template>
    <header class="HeaderBase HeaderBase--shop" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper">
            <nuxt-link class="HeaderBase_button" :to="localePath({ name: '/' })">
                <i class="fal fa-home"></i>
            </nuxt-link>

            <nuxt-link class="HeaderBase_logo" :to="localePath({ name: 'shop' })">
                <icon-base name="logo/logo-main" :height="state.isScrolled ? 35 : 45" />
            </nuxt-link>

            <div>
                <a :href="localePath({ name: 'admin' })" class="HeaderBase_button mr-5" v-if="user && user.role == 'admin'">
                    <i class="fal fa-crown"></i>
                </a>

                <a :href="localePath({ name: 'compte' })" class="HeaderBase_button mr-5">
                    <i class="fal fa-user"></i>
                </a>

                <div class="HeaderBase_button" @click="toggleCart">
                    <i class="fal fa-shopping-cart"></i>

                    <span v-if="cart">{{ cart.items.reduce((p, c) => p + c.quantity, 0) }}</span>
                </div>
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
        cart () { return this.$store.getters['order/get'] },
        user () { return this.$store.state.auth.user }
    },
    mounted () {
        this.$data.categories = {
            courses: { label: `Formations`, icon: 'book-heart', path: { name: 'shop-category', params: { category: 'course' } } },
            coaching: { label: `Coachings`, icon: 'comment-smile', path: { name: 'shop-category', params: { category: 'critique' } } },
            tools: { label: `Boîte à outils`, icon: 'toolbox', path: { name: 'shop-category', params: { category: 'tools' } } },
            sales: { label: `En promo`, icon: 'fire', path: { name: 'shop-category', params: { category: 'en-promo' } } },
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