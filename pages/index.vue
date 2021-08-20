<template>
    <div class="Homearticle">
        <div class="pv-100">
            <div class="Wrapper d-flex">
                <div class="fx-grow pr-20">
                    <p class="Title_secondary color-amber-weak">Bienvenue dans</p>
                    <h1 class="ft-title-2xl-bold">L'Arrière Boutique</h1>

                    <p class="max-width-m mt-5 ft-m">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis non eros sit amet ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit.
                    </p>
                </div>
                <div class="width-s fx-no-shrink">
                    <button-base class="mv-5" :modifiers="['display', 'amazonite']" icon-before="rocket" icon-after="long-arrow-alt-right">
                        Guide de démarrage Etsy
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amber']" icon-before="play" icon-after="long-arrow-alt-right">
                        Tout comprendre en vidéo
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amethyst']" icon-before="heart" icon-after="long-arrow-alt-right">
                        Groupe d'entraide Facebook
                    </button-base>
                </div>
            </div>
        </div>

        <div class="pv-60" :class="[`bg-${$theme(category).color}-2xweak`]" v-for="category in categories" :key="category">
            <div class="Wrapper Wrapper--l">
                <h2 class="ft-title-xl-bold mb-10" :class="[`color-${$theme(category).color}`]">
                    <i class="fa-thin mr-10" :class="[ $theme(category).fa ]"></i>
                    {{ $t(`blog.categories.${category}.label`) }}
                </h2>

                <p class="ft-l mb-20">{{ $t(`blog.categories.${category}.description`) }}</p>

                <article-block
                    :modifiers="['l']"
                    v-bind="{ ...featuredArticle, image: featuredArticle.thumbnail }"
                    :key="featuredArticle.slug"
                />

                <div class="row-s">
                    <div class="col-6 mv-20" v-for="article in articles.slice(0, 2)" :key="article.slug">
                        <article-block
                            :modifiers="['s']"
                            v-bind="{ ...article, image: article.thumbnail }"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-bg-light pv-40">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: {}
        })
    },
    data: () => ({
        categories: ['identity', 'value', 'seo']
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']() },
        featuredArticle () { return this.articles.length > 0 ? this.articles[0] : null }
    },
    head () {
        let meta = {
            title: 'Pages'
        }

        this.$store.commit('page/setColor', 'amber')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>