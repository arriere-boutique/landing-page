<template>
    <div class="BlogPage">
        <div class="pv-40">
            <div class="Wrapper Wrapper">
                <div class="row-xs fx-wrap">
                    <div class="col-6 mv-5 col-12@s">
                        <filter-checkbox
                            :fa="$theme('news').fa"
                            :modifiers="['amber']"
                            :is-checked="categories.includes('news')"
                            :is-active="categories.length == 0 || categories.includes('news')"
                            :title="$t('blog.categories.news.label')"
                            @click.native="toggleCategory('news')"
                        >
                            {{ $t('blog.categories.news.description') }}
                        </filter-checkbox>
                    </div>
                    <div class="col-6 mv-5 col-12@xs">
                        <filter-checkbox
                            :fa="$theme('identity').fa"
                            :modifiers="['amethyst']"
                            :is-checked="categories.includes('identity')"
                            :is-active="categories.length == 0 || categories.includes('identity')"
                            :title="$t('blog.categories.identity.label')"
                            @click.native="toggleCategory('identity')"
                        >
                            {{ $t('blog.categories.identity.description') }}
                        </filter-checkbox>
                    </div>
                    <div class="col-6 mv-5 col-12@xs">
                        <filter-checkbox
                            :fa="$theme('value').fa"
                            :modifiers="['ruby']"
                            :is-checked="categories.includes('value')"
                            :is-active="categories.length == 0 || categories.includes('value')"
                            :title="$t('blog.categories.value.label')"
                            @click.native="toggleCategory('value')"
                        >
                            {{ $t('blog.categories.value.description') }}
                        </filter-checkbox>
                    </div>
                    <div class="col-6 mv-5 col-12@xs">
                        <filter-checkbox
                            :fa="$theme('seo').fa"
                            :modifiers="['malachite']"
                            :is-checked="categories.includes('seo')"
                            :is-active="categories.length == 0 || categories.includes('seo')"
                            :title="$t('blog.categories.seo.label')"
                            @click.native="toggleCategory('seo')"
                        >
                            {{ $t('blog.categories.seo.description') }}
                        </filter-checkbox>
                    </div>
                </div>

                <div class="text-center">
                    <button-base class="mt-10" :modifiers="['secondary', 'amber']" @click="categories = []" v-show="categories.length > 0">
                        Voir tous les articles
                    </button-base>
                </div>
            </div>
        </div>

        <div class="bg-bg-light pv-40">
            <div class="Wrapper Wrapper--s">
                <h2 class="ft-l-bold mb-30">Articles trouvés ({{ articles.length }})</h2>
            </div>
            <div class="Wrapper Wrapper--s">
                <article-block
                    v-for="article in articles"
                    class="mv-20"
                    :modifiers="['horizontal']"
                    v-bind="{ ...article, image: article.thumbnail }"
                    :key="article.slug"
                />
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
            query: { $orCategory: this.$data.categories ? this.$data.categories.join(',') : undefined, status: 'published' }
        })
    },
    data: () => ({
        categories: [],
        cancelToken: null
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']({ status: 'published' }) },
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

        return meta
    }
}
</script>