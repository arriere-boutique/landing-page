<template>
    <div class="HomePage">
        <div class="">
            <div class="Wrapper Wrapper--l d-flex fx-align-center">
                <div class="HomePage_pictures d-none@s">
                    <img class="HomePage_picture" :src="assets.blob1">
                </div>

                <div class="fx-grow pl-30 pl-0@s pb-40@s p-relative">
                    <div class="marker ft-hand-xl color-accent">Bienvenue !</div>

                    <div class="max-width-l mt-10 ft-l">
                        <p><b>Toi et moi,</b> nous avons un rêve commun : faire connaître nos créations et valoriser le fait-main français. C'est pour cette raison que j'ai créé l'Arrière Boutique.</p>

                        <p class="mt-20 color-accent ft-bold">Te transmettre mon expérience de manière simple et pragmatique pour que <b>tu puisses te concentrer sur ce qui te fait vibrer : la création. </b></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="pv-60" :class="[`bg-bg-light`]">
            <div class="Wrapper">
                <div class="d-flex fx-align-center">
                    <div class="fx-grow mr-20">
                        <h2 class="ft-2xl-bold">Articles qui pourraient t'intéresser</h2>
                        <p class="max-width-l mt-5">Te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.</p>
                    </div>
                    
                    <button-base
                        tag="nuxt-link"
                        text="Tous les articles"
                        icon-after="long-arrow-right"
                        :attrs="{ to: localePath({ name: 'category', params: { category: 'blog' } }) }"
                    />
                </div>

                <div class="mt-30 row-s">
                    <div class="col-4">
                        <article-block :modifiers="['story']" v-bind="{ ...articles[0], image: articles[0].thumbnail }" />
                    </div>
                    <div class="col-8">
                        <div class="row-s">
                            <div v-for="article in articles.slice(1, 7)" class="col-4 mb-30" :key="article.slug">
                                <article-block v-bind="{ ...article, image: article.thumbnail }" />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="pv-60" :class="[`bg-gum-xweak`]" v-if="videos.length > 0">
            <div class="Wrapper">
                <h2 class="ft-2xl-bold">Les vidéos <span class="color-accent strike">pour ceux qui n'aiment pas lire</span></h2>
                <p class="max-width-l mt-5">Te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.</p>

                <div class="mt-30 row-xs">
                    <div v-for="video in videos.slice(0, 4)" class="col-3" :key="video.slug">
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