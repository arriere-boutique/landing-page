<template>
    <div class="">
        <div class="pv-40">
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