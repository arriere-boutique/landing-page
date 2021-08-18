<template>
    <div class="ArticlePage ArticlePage--ruby bg-bg-light" v-if="article">
        <div class="ArticlePage_banner pt-20 pb-100">
            <div class="Wrapper">
                <p class="ArticlePage_category Title_secondary mb-5">Valeur perçue</p>
                <h1 class="ArticlePage_title ft-title-3xl-bold">{{ article.title|specials }}</h1>
                <p class="ft-title-m mt-20" v-if="article.excerpt">{{ article.excerpt|specials }}</p>
            </div>
        </div>

        <div class="Wrapper n-mt-40">
            <div class="ArticlePage_cover" v-if="article.cover">
                <img class="width-100" :src="article.cover" />
            </div>
        </div>

        <div class="Wrapper Wrapper--s mt-40">
            <text-body class="TextBody" :value="article.content" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticlePage',
    async fetch () {
        await this.$store.dispatch('articles/get', { query: { slug: this.$route.params.slug }})
    },
    computed: {
        article () {
            return this.$store.getters['articles/findOne']({
                slug: this.$route.params.slug
            })
        }
    },
    head () {
        let meta = {
            title: this.article.title
        }

        this.$store.commit('page/setColor', 'ruby')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>