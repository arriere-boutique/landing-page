<template>
    <div class="ArticlePage" v-if="article">
        <div class="LayoutDefault_banner">
            <div class="Wrapper Wrapper--xs">
                <h1 class="ft-title-3xl-bold color-cherry">{{ article.title }}</h1>
                <p class="ft-l-medium mt-20 max-width-m" v-if="article.excerpt">{{ article.excerpt }}</p>
            </div>
        </div>

        <div class="Wrapper Wrapper--xs mt-60 mb-150">
            <div v-if="article.cover">
                <img class="width-100 n-mt-100 mb-40 br-12" :src="article.cover" />
            </div>

            <text-body class="TextBody" :value="article.content"></text-body>
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
    }
}
</script>