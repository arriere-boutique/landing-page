<template>
    <header class="HeaderBase" :class="{ 'is-scrolled': state.isScrolled }" v-if="items">
        <div class="HeaderBase_wrapper Wrapper Wrapper--l">
            <nuxt-link class="HeaderBase_logo" :to="localePath({ name: '/' })">
                <icon-base
                    name="logo/logo-main"
                    :width="state.isScrolled ? 65 : 85"
                />
            </nuxt-link>

            <nav class="HeaderBase_nav">
                <div class="HeaderBase_navParent" :class="{ 'is-parent': item.items != undefined }" v-for="(item, key) in items" :key="key">
                    <div class="HeaderBase_navLink">
                        <component :is="item.path ? 'nuxt-link' : 'a'" :to="localePath(item.path)" :href="item.href" :target="item.href ? '_blank' : ''">
                            {{ item.label }}
                        </component>

                        <div class="HeaderBase_subNav HeaderBase_subNav--blog" v-if="key == 'articles'">
                            <div class="Wrapper Wrapper--l">
                                <div class="row-xs">
                                    <div class="col-4" v-for="(child, j) in items.articles.items" :key="j">
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
                                    <div class="max-width-l pr-20">
                                        <p class="ft-m-bold mb-10">Sujets populaires</p>

                                        <nuxt-link class="Tag mr-5 mb-10" v-for="(tag, j) in items.articles.tags" :to="localePath(tag.path)" :key="j">
                                            #{{ tag.label }}
                                        </nuxt-link>
                                    </div>

                                    <button-base tag="nuxt-link" :modifiers="['secondary', 'onyx']" icon-after="long-arrow-right" :attrs="{ to: localePath({ name: 'blog' }) }">
                                        Tous les articles
                                    </button-base>
                                </div>
                            </div>
                        </div>
                    </div>
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
        items: null,
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
        this.$data.items = {
            articles: { label: 'Améliorer sa boutique', path: { name: 'blog' }, items: [
                { category: 'identity', path: { name: 'blog', query: { category: 'identity' } } },
                { category: 'value', path: { name: 'blog', query: { category: 'value' } } },
                { category: 'seo', path: { name: 'blog', query: { category: 'seo' } } }
            ], tags: [
                { label: 'Photographie', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Frais de livraison', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Prix', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Packaging', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Mots-clés', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Inspiration', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Taux de conversion', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Visibilité', path: { name: 'blog', query: { tag: 'identity' } } },
                { label: 'Logo', path: { name: 'blog', query: { tag: 'identity' } } },
            ] },
            youtube: { label: 'Apprendre en vidéos', href: 'https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg' },
            about: { label: 'Qui suis-je ?', path: { name: 'about-me' } },
        }

        if (process.server) return

        window.addEventListener('scroll', () => {
            this.$data.scroll = window.pageYOffset
        })
    }
}
</script>