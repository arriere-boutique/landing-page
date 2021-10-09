<template>
    <header class="HeaderBase HeaderBase--shop" :class="{ 'is-scrolled': state.isScrolled }" v-if="items">
        <div class="HeaderBase_wrapper">
            <div class="HeaderBase_left"></div>

            <nuxt-link class="HeaderBase_logo" :to="localePath({ name: '/' })">
                <span class="color-precious-weak strike">L'Arrière</span> Boutique
            </nuxt-link>

            <div class="HeaderBase_right">
                <nav class="HeaderBase_nav">
                    <div v-for="(item, key) in items" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                        <div class="HeaderBase_navLink">
                            <component :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                                {{ item.label }}
                            </component>
                        </div>
                    </div>
                </nav>
            </div>

            <div class="HeaderBase_burger" @click="state.isMenu = true">
                <i class="fa-thin fa-bars"></i>
            </div>

            <div class="HeaderBase_menu" :class="{ 'is-active': state.isMenu }">
                <div class="HeaderBase_navParent" v-for="(item, key) in items" :key="key">
                    <div class="HeaderBase_navLink">
                        <component :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                            {{ item.label }}
                        </component>
                    </div>
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
    name: 'HeaderBase',
    data: () => ({
        scroll: process.client ? window.pageYOffset : 0,
        items: null,
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
    mounted () {
        this.$data.items = {
            youtube: { label: `La boutique`, path: { name: 'shop' } }
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>