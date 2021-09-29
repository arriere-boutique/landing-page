<template>
    <div class="HomePage">
        <div class="">
            <div class="Wrapper Wrapper--l d-flex fx-align-center">
                <div class="HomePage_pictures d-none@s">
                    <div class="HomePage_picture HomePage_picture--1" :style="{ backgroundImage: `url(${assets.outside1})` }"></div>
                    <div class="HomePage_picture HomePage_picture--2" :style="{ backgroundImage: `url(${assets.portrait1})` }"></div>
                </div>

                <div class="fx-grow pl-60 pl-0@s pb-40@s">
                    <p class="Title_secondary color-amber-weak">Bienvenue dans</p>
                    <h1 class="ft-title-3xl-bold ft-title-xl-bold@xs">L'Arrière Boutique</h1>

                    <p class="max-width-l mt-10 ft-l">
                        <b>Toi et moi,</b> nous avons un rêve commun : faire connaître nos créations et valoriser le fait-main français. C'est pour cette raison que j'ai créé l'Arrière Boutique. Te transmettre mon expérience de manière simple et pragmatique pour que <b>tu puisses te concentrer sur ce qui te fait vibrer : la création. </b>
                    </p>

                    <p class="ft-hand-l text-right">Théotime.</p>
                </div>
            </div>
        </div>

        <div class="pv-60" :class="[`bg-${$theme(category).color}-2xweak`]" v-for="category in categories.filter(c => articlesByCategory[c])" :key="category">
            <div class="Wrapper">
                <div class="d-flex fx-align-end mb-20">
                    <div class="fx-grow">
                        <h2 class="ft-title-xl-bold mb-10 ft-title-l-bold@xs" :class="[`color-${$theme(category).color}`]">
                            {{ $t(`blog.categories.${category}.label`) }}
                        </h2>

                        <p class="ft-l">{{ $t(`blog.categories.${category}.description`) }}</p>
                    </div>

                    <button-base tag="nuxt-link" class="fx-no-shrink d-none@xs" :modifiers="[$theme(category).color, 'secondary']" icon-after="long-arrow-right" :attrs="{ to: localePath({ name: 'category', params: { category: $theme(category).slug } }) }">
                        Toute la catégorie
                    </button-base>
                </div>

                <article-block
                    :modifiers="['l']"
                    v-bind="{ ...articlesByCategory[category][0], image: articlesByCategory[category][0].thumbnail }"
                    :key="articlesByCategory[category][0].slug"
                />

                <div class="row-s">
                    <div class="col-4 mv-20 col-12@s" v-for="article in articlesByCategory[category].slice(1, 3)" :key="article.slug">
                        <article-block
                            :modifiers="['horizontal']"
                            v-bind="{ ...article, image: article.thumbnail }"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import portrait1 from '@/assets/img/about/portrait_1.jpg'
import outside1 from '@/assets/img/ambient/outside_1.jpg'

export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: {}
        })
    },
    data: () => ({
        assets: { portrait1, outside1 },
        categories: ['identity', 'value', 'seo']
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']() },
        articlesByCategory () { return this.$store.getters['articles/groupBy']('category') },
        featuredArticle () { return this.articles.length > 0 ? this.articles[0] : null }
    },
    head () {
        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: `J'ai créé l'Arrière Boutique pour te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.` }
            ]
        }

        this.$store.commit('page/setColor', 'amber')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>