<template>
    <div class="Homearticle">
        <div class="pt-30 pb-100">
            <div class="Wrapper d-flex">
                <div class="fx-grow pr-20">
                    <p class="Title_secondary color-amber-weak">Bienvenue dans</p>
                    <h1 class="ft-title-3xl-bold">L'Arrière Boutique</h1>

                    <p class="max-width-m mt-10 ft-l">
                        <b>Toi et moi,</b> nous avons un rêve commun : faire connaître nos créations et valoriser le fait-main français.
                        <br>
                        C'est pour cette raison que j'ai créé l'Arrière Boutique. Te transmettre mon expérience de manière simple et pragmatique pour que <b>tu puisses te concentrer sur ce qui te fait vibrer : la création. </b>
                    </p>
                </div>
                <div class="width-xs fx-no-shrink">
                    <!-- <button-base class="mv-5" :modifiers="['display', 'malachite']" icon-before="rocket" icon-after="long-arrow-right">
                        Guide de démarrage Etsy
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amber']" icon-before="play" icon-after="long-arrow-right">
                        Tout comprendre en vidéo
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amethyst']" icon-before="heart" icon-after="long-arrow-right">
                        Groupe d'entraide Facebook
                    </button-base> -->
                </div>
            </div>
        </div>

        <div class="pv-60" :class="[`bg-${$theme(category).color}-2xweak`]" v-for="category in categories.filter(c => articlesByCategory[c])" :key="category">
            <div class="Wrapper Wrapper--l">
                <div class="d-flex fx-align-end mb-20">
                    <div class="fx-grow">
                        <h2 class="ft-title-xl-bold mb-10" :class="[`color-${$theme(category).color}`]">
                            <i class="fa-thin mr-10" :class="[ $theme(category).fa ]"></i>
                            {{ $t(`blog.categories.${category}.label`) }}
                        </h2>

                        <p class="ft-l">{{ $t(`blog.categories.${category}.description`) }}</p>
                    </div>

                    <button-base class="fx-no-shrink" :modifiers="[$theme(category).color, 'secondary']" icon-after="long-arrow-right">
                        Toute la catégorie
                    </button-base>
                </div>

                <article-block
                    :modifiers="['l']"
                    v-bind="{ ...articlesByCategory[category][0], image: articlesByCategory[category][0].thumbnail }"
                    :key="articlesByCategory[category][0].slug"
                />

                <div class="row-s">
                    <div class="col-6 mv-20" v-for="article in articlesByCategory[category].slice(1, 3)" :key="article.slug">
                        <article-block
                            :modifiers="['s']"
                            v-bind="{ ...article, image: article.thumbnail }"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-bg-light pv-40">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: {}
        })
    },
    data: () => ({
        categories: ['identity', 'value', 'seo']
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']() },
        articlesByCategory () { return this.$store.getters['articles/groupBy']('category') },
        featuredArticle () { return this.articles.length > 0 ? this.articles[0] : null }
    },
    head () {
        let meta = {
        }

        this.$store.commit('page/setColor', 'amber')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>