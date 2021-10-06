<template>
    <article class="ArticlePage bg-bg-light" v-if="article">
        <div class="ArticlePage_banner pt-20 pb-100">
            <div class="Wrapper">
                <p class="ArticlePage_category mb-5">
                    <i class="fa-thin mr-5" :class="[ $theme(article.category).fa ]"></i> {{ $t(`blog.categories.${article.category}.label`) }}
                </p>

                <h1 class="ArticlePage_title ft-3xl-bold ft-xl-bold@s">{{ article.title|specials }}</h1>

                <text-body class="ArticlePage_excerpt mt-20" :value="article.excerpt" v-if="article.excerpt" />
            </div>
        </div>

        <div class="Wrapper n-mt-40">
            <div class="ArticlePage_cover" v-if="article.cover">
                <img class="width-100" :src="article.cover" />
            </div>
        </div>

        <div class="Wrapper Wrapper--s mt-40 pb-100">
            <text-body :value="article.content" />

            <div class="mt-20 text-right">
                <p v-if="updatedDate">Mis à jour le {{ updatedDate }}</p>
                <p :class="{ 'color-ft-weak': updatedDate }">Publié le {{ createdDate }}</p>
            </div>
        </div>

        <div class="pv-40" :class="[ 'bg-current-2xweak' ]">
            <div class="Wrapper Wrapper--m">
                <!-- <author-block class="n-mt-60 mb-40" /> -->

                <div class="text-center" v-if="similarArticles.length > 0">
                    <p class="ft-l-bold color-current mb-20">
                        À lire ensuite
                    </p>

                    <div class="row-xs">
                        <div class="col-3 col-12@xs mv-5" v-for="similar in similarArticles" :key="similar._id">
                            <article-block
                                :modifiers="['horizontal']"
                                v-bind="{ ...similar, image: similar.thumbnail }"
                            />
                        </div>
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
        await this.$store.dispatch('articles/fetch')
    },
    computed: {
        article () {
            return this.$store.getters['articles/findOne']({
                slug: this.$route.params.slug
            })
        },
        similarArticles () {
            let articles = this.$store.getters['articles/find']({
                category: this.article.category
            })

            articles = articles.filter(article => article._id !== this.article._id)

            return articles
        },
        updatedDate () {
            return this.article.createdAt.isSame(this.article.updatedAt) ? null : this.article.updatedAt.format('DD MMM YYYY')
        },
        createdDate () {
            return this.article.createdAt.format('DD MMM YYYY')
        }
    },
    head () {
        let meta = {
            title: this.article.title + this.$t('meta.append'),
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
                            headline: this.article.title,
                            image: this.article.cover,
                            thumbnailUrl: this.article.thumbnail,
                            dateCreated: this.article.createdAt.toISOString(),
                            dateUpdated: this.article.updatedAt.toISOString(),
                            author: this.$authorData()
                        }
                    }
                }
            ]
        }

        this.$store.commit('page/setColor', this.$theme(this.article.category).color);

        return meta
    }
}
</script>