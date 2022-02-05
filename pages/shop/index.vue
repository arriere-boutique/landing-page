<template>
    <div class="ShopPage">
        <div class="Wrapper Wrapper--m d-flex fx-align-center fx-justify-between pv-60 pv-30@s d-block@s">
            <div class="max-width-l pr-30 pr-0@s width-100@s mb-30@s text-center@s">
                <h1 class="ft-3xl-bold ft-2xl-bold@s">Créer des expériences d'achat <span class="color-current">mémorables</span></h1>
                <p class="ft-l-medium mt-20">
                    Augmente la valeur perçue de tes colis : cartes de visites, stickers personnalisés… <span class="color-current">Avec un accompagnement personnalisé</span> pour toujours faire des choix qui font sens pour ta marque.
                </p>

                <button-base class="mt-30" :modifiers="['current', 'icon-gum']" tag="a" link="https://arriereboutiquefr.etsy.com" icon-before="box-open-full" target="_blank">Visiter la boutique Etsy</button-base>
            </div>

            <a href="https://arriereboutiquefr.etsy.com" class="text-center d-block" target="_blank">
                <img :src="assets.blob1" class="max-width-s@s">
            </a>
        </div>

        <div class="is-gum bg-current-xweak pv-60" v-if="courses.length > 0">
            <div class="Wrapper">
                <div class="max-width-m">
                    <h2 class="ft-2xl-bold">Analyses <span class="color-current">de boutique</span></h2>
                    <p class="ft-m-medium mt-5">
                        Dans un format simple et compréhensible, je relève les points à améliorer sur ta boutique, en vidéo.
                    </p>
                </div>

                <div class="row-xs mt-30">
                    <div class="col-3 mv-5 col-6@s col-12@xs" v-for="product in courses" :key="product._id">
                        <product-block
                            v-bind="product"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="is-gum bg-current-xweak pv-60" v-if="critiques.length > 0">
            <div class="Wrapper">
                <div class="max-width-m">
                    <h2 class="ft-2xl-bold">Analyses <span class="color-current">de boutique</span></h2>
                    <p class="ft-m-medium mt-5">
                        Dans un format simple et compréhensible, je relève les points à améliorer sur ta boutique, en vidéo.
                    </p>
                </div>

                <div class="row-xs mt-30">
                    <div class="col-3 mv-5 col-6@s col-12@xs" v-for="product in critiques" :key="product._id">
                        <product-block
                            v-bind="product"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import blob1 from '@/assets/img/blob/blob-shop.jpg'

export default {
    name: 'ShopPage',
    layout: 'shop',
    async fetch () {
        await this.$store.dispatch('products/fetch', {
            query: { status: 'published' }
        })
    },
    data: () => ({
        assets: { blob1 }
    }),
    computed: {
        courses () { return this.$store.getters['products/find']({ status: 'published', category: 'course' }) },
        critiques () { return this.$store.getters['products/find']({ status: 'published', category: 'critique' }) },
    },
    head () {
        let meta = {
            title: `La Boutique de L'Arrière Boutique | Formations & coachings Etsy`,
            meta: [
                { hid: 'description', name: 'description', content: `Je te propose des coachings et formations, pour que tu puisses te sentir de plus en plus à l'aise avec ta boutique.` }
            ]
        }

        this.$store.commit('page/setColor', 'ice')

        return meta
    }
}
</script>