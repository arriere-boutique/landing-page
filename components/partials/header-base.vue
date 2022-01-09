<template>
    <header class="HeaderBase" :class="{ 'is-scrolled': state.isScrolled }">
        <div class="HeaderBase_wrapper">
            <div class="HeaderBase_left">
                <nuxt-link class="HeaderBase_logo" :to="localePath({ name: '/' })">
                    <icon-base name="logo/logo-main" :height="state.isScrolled ? 35 : 45" />
                </nuxt-link>
            </div>

            <div class="HeaderBase_right">
                <nav class="HeaderBase_nav">
                    <div v-for="(item, key) in itemsLeft" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                        <component  class="HeaderBase_navLink" :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                            {{ item.label }}
                        </component>

                        <div class="HeaderBase_subNav HeaderBase_subNav--blog" v-if="key == 'articles'">
                            <div class="Wrapper Wrapper--l">
                                <div class="row-xs">
                                    <div class="col-4" v-for="(child, j) in itemsLeft.articles.items" :key="j">
                                        <nuxt-link class="HeaderBase_categoryLink" :class="[ 'is-' + $theme(child.category).color ]" :to="localePath(child.path)">
                                            <div class="ft-xl pr-15 color-current">
                                                <i class="fal" :class="[ $theme(child.category).fa ]"></i>
                                            </div>

                                            <div>
                                                <p class="ft-m-bold color-current">{{ $t(`blog.categories.${child.category}.label`) }}</p>
                                                <p class="ellipsis-2">
                                                    {{ $t(`blog.categories.${child.category}.description`) }}
                                                </p>
                                            </div>
                                        </nuxt-link>
                                    </div>
                                </div>

                                <hr class="Separator mv-20">

                                <div class="d-flex fx-align-center fx-justify-between">
                                    <div class="max-width-l pr-20" v-if="itemsLeft.articles.tags.length > 0">
                                        <p class="ft-m-bold mb-10">Sujets populaires</p>

                                        <nuxt-link class="Tag mr-5 mb-10" v-for="(tag, j) in itemsLeft.articles.tags" :to="localePath(tag.path)" :key="j">
                                            #{{ tag.label }}
                                        </nuxt-link>
                                    </div>

                                    <button-base tag="nuxt-link" icon-after="long-arrow-right" :attrs="{ to: localePath({ name: 'category', params: { category: 'blog' } }) }">
                                        Tous les articles
                                    </button-base>
                                </div>
                            </div>
                        </div>
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

                <a :href="localePath({ name: 'dashboard' })" class="HeaderBase_button mr-5">
                    <i class="fal fa-user"></i>
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
            articles: { label: 'Articles & astuces', path: { name: 'category', params: { category: 'blog' } }, items: [
                { category: 'identity', path: { name: 'category', params: { category: this.$theme('identity').slug } } },
                { category: 'value', path: { name: 'category', params: { category: this.$theme('value').slug } } },
                { category: 'seo', path: { name: 'category', params: { category: this.$theme('seo').slug } } }
            ], tags: [] },
            about: { label: `Qui suis-je ?`, path: { name: 'moi-moi-moi' } },
        }

        this.$data.itemsRight = {
            shop: { label: `La boutique`, path: { name: 'shop' } }
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>