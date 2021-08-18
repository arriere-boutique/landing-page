<template>
    <div class="">
        <div class="pv-40">
            
            <div class="Wrapper">
                <div class="row-xs">
                    <div class="col-6">
                        <filter-checkbox
                            fa="thumbtack"
                            :modifiers="['amber']"
                            :is-checked="categories.includes('news')"
                            :is-active="categories.length == 0 || categories.includes('news')"
                            :title="$t('blog.categories.news.label')"
                            @click.native="toggleCategory('news')"
                        >
                            {{ $t('blog.categories.news.description') }}
                        </filter-checkbox>

                        <filter-checkbox
                            class="mt-10"
                            fa="camera"
                            :modifiers="['amethyst']"
                            :is-checked="categories.includes('identity')"
                            :is-active="categories.length == 0 || categories.includes('identity')"
                            :title="$t('blog.categories.identity.label')"
                            @click.native="toggleCategory('identity')"
                        >
                            {{ $t('blog.categories.identity.description') }}
                        </filter-checkbox>
                    </div>
                    <div class="col-6">
                        <filter-checkbox
                            fa="heart"
                            :modifiers="['ruby']"
                            :is-checked="categories.includes('value')"
                            :is-active="categories.length == 0 || categories.includes('value')"
                            :title="$t('blog.categories.value.label')"
                            @click.native="toggleCategory('value')"
                        >
                            {{ $t('blog.categories.value.description') }}
                        </filter-checkbox>

                        <filter-checkbox
                            class="mt-10"
                            fa="search"
                            :modifiers="['amazonite']"
                            :is-checked="categories.includes('seo')"
                            :is-active="categories.length == 0 || categories.includes('seo')"
                            :title="$t('blog.categories.seo.label')"
                            @click.native="toggleCategory('seo')"
                        >
                            {{ $t('blog.categories.seo.description') }}
                        </filter-checkbox>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-bg-light pv-40">
            <div class="Wrapper">
                <article-block
                    v-for="article in articles"
                    class="mv-20"
                    v-bind="{ ...article, image: article.thumbnail }"
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
    data: () => ({
        categories: []
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']() },
        featuredArticle () { return this.articles.length > 0 ? this.articles[0] : null }
    },
    watch: {
        categories: {
            immediate: true,
            async handler (v) {
                let search = await this.$store.dispatch('articles/fetch', {
                    query: { $orCategory: v ? v.join(',') : undefined }
                })
            }
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
        let meta = {
            title: 'Pages'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>