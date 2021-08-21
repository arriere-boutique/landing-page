<template>
    <article class="ArticlePage ArticlePage--ruby bg-bg-light" v-if="article">
        <div class="ArticlePage_banner pt-20 pb-100">
            <div class="Wrapper">
                <p class="ArticlePage_category mb-5">
                    <i class="fa-thin mr-5" :class="[ $theme(article.category).fa ]"></i> {{ $t(`blog.categories.${article.category}.label`) }}
                </p>

                <h1 class="ArticlePage_title ft-title-3xl-bold">{{ article.title|specials }}</h1>

                <text-body class="ArticlePage_excerpt mt-20" :value="article.excerpt" v-if="article.excerpt" />
            </div>
        </div>

        <div class="Wrapper n-mt-40">
            <div class="ArticlePage_cover" v-if="article.cover">
                <img class="width-100" :src="article.cover" />
            </div>
        </div>

        <div class="Wrapper Wrapper--s mt-40">
            <text-body :value="article.content" />
        </div>

        <div class="bg-amber-2xweak pv-60 mt-60">
            <div class="Wrapper Wrapper--l">

                <div class="d-flex">
                    <p class="ft-title-xl-bold width-xs fx-no-shrink">5000€ / mois sans rien faire ?</p>
                    <div class="ft-l">
                        <p>
                            <b>Soyons sérieux !</b> Développer une marque et commencer à vivre de ses créations prend du temps et beaucoup d'efforts. Je n'ai aucun intérêt à te vendre du rêve. Mais je suis là pour t'aider à faire rêver à tes clients grâce à tes créations originales.
                        </p>

                        <button-base class="mt-20" :modifiers="['amber']">Découvrir l'Arrière Boutique</button-base>
                    </div>
                </div>
            </div>
        </div>
    </article>
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
            title: this.article.title + ` / L'Arrière Boutique, propulsez votre boutique Etsy`,
            meta: [
                { hid: 'description', name: 'description', content: this.article.excerpt.replace(/(<([^>]+)>)/gi, "") }
            ],
            script: [
                {
                    type: 'application/ld+json', json: {
                        structuredData: {
                            "@context": "http://schema.org",
                            "@type": "Article",
                            articleSection: this.$t(`blog.categories.${this.article.category}.label`),
                            articleBody: this.article.content.replace(/(<([^>]+)>)/gi, ""),
                            name: this.article.title,
                            image: this.article.cover,
                            thumbnailUrl: this.article.thumbnail,
                            dateCreated: this.article.createdAt,
                            dateUpdated: this.article.updatedAt,
                            author: this.$authorData()
                        }
                    }
                }
            ]
        }

        switch (this.article.category) {
            case 'news': this.$store.commit('page/setColor', 'amber'); break;
            case 'identity': this.$store.commit('page/setColor', 'amethyst'); break;
            case 'value': this.$store.commit('page/setColor', 'ruby'); break;
            case 'seo': this.$store.commit('page/setColor', 'malachite'); break;
            default: this.$store.commit('page/setColor', 'amber'); break;
        }

        return meta
    }
}
</script>