<template>
    <div class="BlogPage bg-bg-light">
        <div class="pv-40">
            <div class="Wrapper Wrapper--l">
                <div class="d-flex d-block@s">
                    <div class="fx-grow">
                        <h2 class="ft-2xl-bold mb-30 ft-l-bold@s mb-10@s">Articles trouvés ({{ articles.length }})</h2>
                        
                        <article-block
                            v-for="article in articles"
                            class="mv-20 mb-10@xs"
                            :modifiers="['horizontal']"
                            v-bind="{ ...article, image: article.thumbnail }"
                            :key="article.slug"
                        />
                    </div>

                    <div class="BlogPage_filters ml-30 d-none@s">
                        <p class="ft-l-bold mb-10">Filter par catégorie :</p>

                        <filter-checkbox
                            v-for="category in ['news', 'identity', 'value', 'seo']"
                            class="mb-10"
                            :fa="$theme(category).fa"
                            :is-checked="categories.includes(category)"
                            :is-active="categories.length == 0 || categories.includes(category)"
                            :title="$t(`blog.categories.${category}.label`)"
                            @click.native="toggleCategory(category)"
                            :key="category"
                        >
                            {{ $t(`blog.categories.${category}.description`) }}
                        </filter-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeBlog',
    async fetch () {
        if (this.$route.params.category && this.$route.params.category != 'blog') {
            this.$data.categories = [ this.$slugToCategory(this.$route.params.category) ]
            return
        }
        
        await this.$store.dispatch('articles/fetch', {
            query: { type: 'article', $orCategory: this.$data.categories ? this.$data.categories.join(',') : undefined, status: 'published' }
        })
    },
    data: () => ({
        categories: [],
        cancelToken: null
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']({ type: 'article', status: 'published' }) },
        featuredArticle () { return this.articles.length > 0 ? this.articles[0] : null }
    },
    watch: {
        '$route.query.category' (v) {
            this.$data.categories = v ? [ v ] : []
        },
        async categories (v) {
            if (this.$data.cancelToken) this.$data.cancelToken.cancel()
            this.$data.cancelToken = this.$axios.CancelToken.source()

            await this.$store.dispatch('articles/fetch', {
                query: { $orCategory: v ? v.join(',') : undefined },
                cancelToken: this.$data.cancelToken
            })
        }
    },
    methods: {
        toggleCategory (id) {
            if (this.$data.categories.includes(id)) {
                this.$data.categories = this.$data.categories.filter(i => i !== id)
            } else {
                this.$data.categories = [...this.$data.categories, id]
            }
        }
    },
    head () {
        let category = null

        if (this.$route.params.category && this.$route.params.category != 'blog') {
            category = this.$slugToCategory(this.$route.params.category)
        }

        let meta = {
            title: (category ? this.$t(`blog.categories.${category}.description`) : "Toutes les clés pour améliorer sa boutique Etsy") + this.$t('meta.append'),
            meta: [
                { hid: 'description', name: 'description', content: category ? `Tous mes conseils et astuces pour ` + this.$t(`blog.categories.${category}.description`).toLowerCase() : `Bienvenue sur le blog de l'Arrière Boutique, où je te partage mes astuces et guides pour que tu puisses réussi sur Etsy.` }
            ]
        }

        this.$store.commit('page/setColor', 'pond')

        return meta
    }
}
</script>

<style lang="scss" scoped>
.BlogPage_filters {
    width: 350px;
    flex-shrink: 0;
}
</style>