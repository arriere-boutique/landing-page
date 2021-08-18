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

        <div class="bg-amethyst-2xweak pv-60" v-if="featuredArticle">
            <div class="Wrapper Wrapper--l">
                <h2 class="ft-title-xl-bold color-amethyst mb-20">Dernier article populaire</h2>

                <article-block
                    :modifiers="['l']"
                    v-bind="{ ...featuredArticle, image: featuredArticle.thumbnail }"
                    category="Etsy SEO"
                    :key="featuredArticle.slug"
                />
            </div>
        </div>
        
        <div class="bg-bg-light pv-40">
            <div class="Wrapper">
                <article-block
                    v-for="article in articles"
                    class="mv-20"
                    v-bind="{ ...article, image: article.thumbnail }"
                    category="Etsy SEO"
                    :key="article.slug"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Homearticle',
    async fetch () {
        this.$store.commit('page/setColor', 'ruby')
        await this.$store.dispatch('articles/fetch', {
            query: {}
        })
    },
    computed: {
        articles () { return this.$store.getters['articles/find']() },
        featuredArticle () { return this.articles.length > 0 ? this.articles[0] : null }
    },
    head () {
        let meta = {
            title: 'Pages'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>