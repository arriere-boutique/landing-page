<template>
    <div class="HomePage">
        <div class="Wrapper d-flex fx-align-center d-block@s">
            <div class="HomePage_pictures">
                <img class="HomePage_picture" :src="assets.blob1">
            </div>

            <div class="fx-grow pl-30 pl-0@s pb-40@s p-relative">
                <div class="marker ft-hand-xl color-current ml-40@s n-mt-20@s">Bienvenue !</div>

                <div class="max-width-l mt-10 ft-l">
                    <p><b>Toi et moi,</b> nous avons un rêve commun : faire connaître nos créations et valoriser le fait-main français. C'est pour cette raison que j'ai créé l'Arrière Boutique.</p>

                    <p class="mt-20 color-current ft-bold">Te transmettre mon expérience de manière simple et pragmatique pour que <b>tu puisses te concentrer sur ce qui te fait vibrer : la création. </b></p>
                </div>
            </div>
        </div>

        <div class="bg-bg-light pv-60 is-ice">
            <div class="Wrapper">
                <div class="d-flex fx-align-center d-block@s">
                    <div class="fx-grow mr-20 mr-0@s">
                        <h2 class="ft-2xl-bold">Articles qui pourraient t'intéresser</h2>
                        <p class="max-width-l mt-5">Fais le plein d'informations et de guides pour mieux comprendre l'éco-système de la vente en ligne.</p>
                    </div>
                    
                    <button-base
                        class="mt-20@s"
                        tag="nuxt-link"
                        text="Tous les articles"
                        icon-after="long-arrow-right"
                        :modifiers="['current']"
                        :attrs="{ to: localePath({ name: 'category', params: { category: 'blog' } }) }"
                    />
                </div>

                <div class="mt-30 row-s" v-if="articles.length > 0">
                    <div class="col-4 col-12@s">
                        <article-block :modifiers="['story']" v-bind="{ ...articles[0], image: articles[0].cover }" />
                    </div>
                    <div class="col-8 col-12@s">
                        <div class="row-s mt-10@s">
                            <div v-for="article in articles.slice(1, 7)" class="col-4 col-6@s col-12@xs mb-30 mb-20@s" :key="article.slug">
                                <article-block v-bind="{ ...article, image: article.thumbnail }" />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="pv-60 is-gum" :class="[`bg-bg-xweak`]" v-if="videos.length > 0">
            <div class="Wrapper">
                <div class="d-flex fx-align-center d-block@s">
                    <div class="fx-grow mr-20 mr-0@s">
                        <h2 class="ft-2xl-bold">Les vidéos <span class="color-current strike">pour ceux qui n'aiment pas lire</span></h2>
                        <p class="max-width-l mt-5">Je publie régulièrement des vidéos pour parler un peu plus en détails de sujets qui me tiennent à coeur. N'hésite pas à t'abonner !</p>
                    </div>
                    
                    <button-base
                        class="mt-20@s"
                        tag="a"
                        :modifiers="['current']"
                        text="La chaîne Youtube"
                        icon-after="play"
                        link="https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg"
                        target="_blank"
                    />
                </div>

                <div class="mt-30 row-xs">
                    <div v-for="video in videos.slice(0, 4)" class="col-3 col-6@s col-12@xs" :key="video.slug">
                        <article-block
                            v-bind="{
                                ...video,
                                image: video.thumbnail
                            }"
                            :modifiers="['story']"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import blob1 from '@/assets/img/blob/blob-home.jpg'

export default {
    name: 'Homepage',
    layout: 'blog',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: { status: 'published' }
        })
    },
    data: () => ({
        assets: { blob1 }
    }),
    computed: {
        articles () { return this.$store.getters['articles/find']({ status: 'published', type: 'article' }) },
        videos () { return this.$store.getters['articles/find']({ status: 'published', type: 'youtube' }) }
    },
    head () {
        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: `J'ai créé l'Arrière Boutique pour te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.` }
            ]
        }

        this.$store.commit('page/setColor', 'gum')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>