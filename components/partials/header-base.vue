<template>
    <header class="HeaderBase" :class="{ 'is-scrolled': state.isScrolled }" v-if="itemsLeft">
        <div class="HeaderBase_wrapper">
            <div class="HeaderBase_left">
                <nav class="HeaderBase_nav">
                    <div v-for="(item, key) in itemsLeft" class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }"  :key="key">
                        <div class="HeaderBase_navLink">
                            <component :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
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

                                        <button-base tag="nuxt-link" :modifiers="['secondary', 'onyx']" icon-after="long-arrow-right" :attrs="{ to: localePath({ name: 'category' }) }">
                                            Tous les articles
                                        </button-base>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <nuxt-link class="HeaderBase_logo" :to="localePath({ name: '/' })">
                <icon-base
                    name="logo/logo-main"
                    :width="state.isScrolled ? 65 : 85"
                />
            </nuxt-link>

            <div class="HeaderBase_right">
                <div class="HeaderBase_navLink">
                    <a href="https://arriereboutiquefr.etsy.com/" target="_blank">
                        <i class="fal fa-shopping-cart mr-5"></i> Boutique des vendeurs
                    </a>
                </div>
            </div>

            <div class="HeaderBase_burger" @click="state.isMenu = true">
                <i class="fa-thin fa-bars"></i>
            </div>

            <div class="HeaderBase_menu" :class="{ 'is-active': state.isMenu }">
                <div class="HeaderBase_navParent" v-for="(item, key) in itemsLeft" :key="key">
                    <div class="HeaderBase_navLink">
                        <component :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                            {{ item.label }}
                        </component>
                    </div>
                </div>

                <div class="HeaderBase_navLink">
                    <a href="https://arriereboutiquefr.etsy.com/" target="_blank">
                        <i class="fal fa-shopping-cart mr-5"></i> Boutique des vendeurs
                    </a>
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
        itemsLeft: null,
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
        this.$data.itemsLeft = {
            articles: { label: 'Améliorer sa boutique', path: { name: 'category', params: { category: 'blog' } }, items: [
                { category: 'identity', path: { name: 'category', params: { category: this.$theme('identity').slug } } },
                { category: 'value', path: { name: 'category', params: { category: this.$theme('value').slug } } },
                { category: 'seo', path: { name: 'category', params: { category: this.$theme('seo').slug } } }
            ], tags: [] },
            youtube: { label: 'Apprendre en vidéos', href: 'https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg' }
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>