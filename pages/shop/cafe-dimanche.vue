<template>
    <div class="LandingPage is-precious">
        <div class="LandingPage_background" :style="{ '--image': `url('${assets.background}')` }"></div>
        
        <div class="Wrapper Wrapper--s pv-60 pv-0@s">
            <div class="bg-bg-light p-30 br-10 p-0@s bg-skylight-xweak@s">
                <img :src="assets.banner" class="width-100 br-4">

                <h1 class="ft-2xl-bold mt-20 ft-xl-bold@s">
                    Parlons de ta boutique #CaféDimanche
                </h1>
                <h2 class="ft-xl ft-l-bold@s">30 minutes pour débloquer ta boutique.</h2>

                <p class="mt-20">Tous les dimanches, j'ouvre ma ligne téléphonique à tous les créateurs & créatrices de France. Que ta boutique en ligne soit sur Etsy ou ailleurs, <b>ça fait parfois du bien de se sentir entendu·e.</b></p>

                <div class="ft-l pl-10 mv-20 ft-m@s pl-0@s">
                    <div class="mb-10">
                        😢 <b class="ft-medium">Tu as tout essayé pour vendre plus et tu ne sais plus quoi faire ?</b>
                    </div>
                    <div class="mv-10">
                        😐 <b class="ft-medium">Tu hésites et tu as besoin d'un conseil pour prendre une décision ?</b>
                    </div>
                    <div class="mv-10">
                        😅 <b class="ft-medium">Tu ne t'es pas encore lancé·e et tu as besoin d'un peu de motivation ?</b>
                    </div>
                    <div class="mt-10">
                        😄 <b class="ft-medium">Tu as juste envie de discuter de ta boutique ?</b>
                    </div>
                </div>

                <div class="d-flex fx-align-top bg-precious-xweak p-20 br-4 mt-30 d-block@s mt-0@s p-0@s bg-skylight-xweak@s mb-30@s">
                    <div>
                        <h3 class="ft-l-bold color-accent">Parfois un avis extérieur est tout ce qu'il te faut.</h3>
                        <div>Seulement 4 places disponibles par semaine. Créneaux visibles deux semaines à l'avance.</div>
                    </div>
                    <div class="ml-20 text-right fx-no-shrink ml-0@s mt-20@s text-center@s">
                        <button-base :modifiers="['precious']" icon-before="coffee" :attrs="{ onclick: `Calendly.initPopupWidget({ url: 'https://calendly.com/arriere-boutique/cafe-dimanche?hide_gdpr_banner=1&hide_event_type_details=1&primary_color=7156ec'});return false;` }">
                            Je réserve
                        </button-base>
                        <p class="ft-2xl-bold mb-5 text-right line-1 mt-10 text-center@s">
                            <span class="ft-l strike">34.90€</span>
                            16.90€
                        </p>
                    </div>
                </div>

                <div class="bg-skylight-xweak p-20 text-center mt-10 br-4">
                    <p class="ft-l-bold">Plus de place ?</p>
                    <link-base link="https://calendly.com/arriere-boutique" target="_blank">Voir les autres dispos</link-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import banner from '@/assets/img/landing/coffee-sunday.gif'
import background from '@/assets/img/animated/coffee-shop-2.gif'

export default {
    name: 'CaféDimanche',
    layout: 'shop',
    data: () => ({
        assets: { banner, background }
    }),
    computed: {
    },
    head () {
        let meta = {
            title: `Appel express 30 minutes | Formations & coachings Etsy`,
            meta: [
                { hid: 'description', name: 'description', content: `Je te propose des coachings et formations, pour que tu puisses te sentir de plus en plus à l'aise avec ta boutique.` }
            ]
        }

        this.$store.commit('page/setColor', 'skylight')
        this.$store.commit('page/setClasses', [ 'header-fill' ])

        return meta
    },
    beforeDestroy () {
        this.$store.commit('page/setClasses', [])
    }
}
</script>