<template>
    <header class="HeaderBase" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper Wrapper Wrapper--l">
            <div class="HeaderBase_left">
                <a class="HeaderBase_logo" :href="$baseUrl">
                    <icon-base name="logo/logo-main" :height="state.isScrolled ? 35 : 40" />
                </a>
            </div>

            <div class="HeaderBase_right">
                <nav class="HeaderBase_nav">
                    <div v-for="(item, key) in itemsLeft" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                        <component  class="HeaderBase_navLink" :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.target ? item.target : ''">
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
                <div class="HeaderBase_navParent" v-for="(item, key) in itemsLeft" :key="key">
                    <component
                        class="HeaderBase_navLink"
                        :is="item.path ? 'nuxt-link' : 'a'"
                        :to="localePath(item.path)"
                        :href="item.href"
                        :target="item.target ? item.target : ''"
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
    name: 'HeaderBase',
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
            register: { label: 'Créer mon Arrière Boutique', href: process.env.dashboardUrl + '/register' },
            blog: { label: 'Le blog', href: process.env.blogUrl },
            login: { label: 'Se connecter', href: process.env.dashboardUrl }
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>