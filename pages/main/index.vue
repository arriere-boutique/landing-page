<template>
    <div class="HomePage">
        <div class="HomePage_section1 is-pond Wrapper Wrapper--m pb-40@s">
            <div class="fx-grow pv-40@s">
                <div class="max-width-m">
                    <h1 class="Title--xl">Vendre en ligne <b>n'a plus à être une corvée.</b></h1>
                    
                    <h2 class="ft-xl-medium color-ft mt-30">Tout ce qui t'a toujours manqué pour gérer ta boutique Etsy, réuni au même endroit <i class="fal fa-sparkles ml-3"></i></h2>

                    <form class="d-flex mt-30 text-center d-block@s" @submit.prevent="onRegister">
                        <input-base type="email" label="Ton adresse e-mail" v-model="formData.email" />

                        <button-base type="submit" class="ml-20 ml-0@s mt-10@s" :modifiers="[]">
                            Je m'inscris, c'est gratuit
                        </button-base>
                    </form>
                </div>
            </div>

            <div class="HomePage_section1right">
                <video class="HomePage_section1video" autoplay loop muted>
                    <source :src="assets.video1" type="video/mp4">
                </video>

                <macaron class="Macaron is-ice" :modifiers="['light']" name="label/france">
                    <img :src="assets.france" width="20" class="d-block">
                </macaron>
            </div>
        </div>

        <div class="Section3 is-gum bg-bg-light pv-20">
            <div class="Section3_wrapper fx-center Wrapper Wrapper--l">
                <div class="max-width-xl">
                    <div class="mv-40">
                        <h3 class="Title--xl mb-10">Ton Arrière Boutique, c'est <b class="ft-medium">ton espace pour gérer ta boutique Etsy</b></h3>
                        <p class="ft-l max-width-l">Tu n'es plus seul·e. Grâce à tes nouveaux outils ultra-faciles à prendre en main, tu as plus de temps pour créer.</p>

                        <div class="mt-30 row ft-m-medium color-current-xstrong">
                            <div class="col-6 col-12@s">
                                <p class="mv-5"><i class="fal fa-check mr-5"></i> Crée une page d'accueil personnalisée</p>
                                <p class="mv-5"><i class="fal fa-check mr-5"></i> Génére des mots-clés en quelques clics</p>
                            </div>
                            <div class="col-6 col-12@s">
                                <p class="mv-5"><i class="fal fa-check mr-5"></i> Calcule ta marge simplement</p>
                            </div>
                        </div>

                        <div class="bg-current-xweak mt-30 ph-30 pv-20 br-m">
                            <p class="ft-l-bold color-current-xstrong">Et bientôt aussi...</p>
                            <div class="mt-10 row ft-m-medium color-current-strong">
                                <div class="col-6 col-12@s">
                                    <p class="mt-10 d-flex"><i class="fal fa-chart-line mr-10 mt-3"></i> Compare tes prix à la concurrence</p>
                                    <p class="mt-10 d-flex"><i class="fal fa-rectangle-vertical-history mr-10 mt-3"></i> Gére plusieurs boutiques au même endroit</p>
                                    <p class="mt-10 d-flex"><i class="fal fa-gift-card mr-10 mt-3"></i> Imprime les messages cadeau en un clic</p>
                                </div>
                                <div class="col-6 col-12@s">
                                    <p class="mt-10 d-flex"><i class="fal fa-trophy mr-10 mt-3"></i> Organise des jeux-concours interactifs</p>
                                    <p class="mt-10 d-flex"><i class="fal fa-sparkles mr-10 mt-3"></i> Permet à tes clients de vraiment personnaliser leur commandes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="">
                    
                </div>
            </div>
        </div>

        <div class="Section2" :class="[ `is-${landings[currentLanding].color}` ]" v-if="landings[currentLanding]">
            <div class="Section2_wrapper fx-center Wrapper Wrapper--m">
                <div class="Section2_left">
                    <h2 class="Title--xl">Crée aujourd'hui <b class="ft-medium">la page qui te ressemble</b>, en quelques clics</h2>

                    <p class="ft-l mt-20">Les plateformes comme Etsy souvent trop limitées en personnalisation. Immerge tes clients dans TON univers avant de les diriger vers l'achat.</p>

                    <p class="Tag Tag--l mt-40">C'est gratuit.</p>

                    
                    <link-base @click="onRegister" :modifiers="['ft']" class="ml-10">
                        Créer ma page
                    </link-base>
                </div>
                <div class="Section2_right">
                    <transition-group name="fade-h">
                        <img class="Section2_landing" v-for="landing in landings" :src="landing.landing" :key="landing.id" v-show="landing.id == currentLanding">
                    </transition-group>

                    <transition-group name="fade-h">
                        <div class="Section2_image" v-for="landing in landings" :style="{ backgroundImage: `url(${landing.background})` }" :key="landing.id" @click="nextLanding" v-show="landing.id == currentLanding"></div>
                    </transition-group>

                    <i class="Section2_arrow fal fa-long-arrow-right" @click="nextLanding"></i>
                </div>
            </div>
        </div>

        <div class="Section4 is-ice bg-bg-light">
            <div class="Section4_wrapper d-flex Wrapper Wrapper--l">
                <div class="Section4_left">
                   <div class="Section4_portrait" :style="{ backgroundImage: `url(${assets.about})` }"></div>

                    <macaron class="Macaron_2 is-ice" name="label/france">
                        <img :src="assets.france" width="20" class="d-block">
                    </macaron>
                </div>
                <div class="Section4_right ft-l pv-60">
                    <h2 class="Title--l mb-20">Par un créateur français, <b class="ft-medium">pour les créateurs français</b></h2>

                    <p>J'ai cherché des outils simples et pratiques qui me permettraient de me faciliter ma vie au quotidien. Mais souvent, les outils proposés étaient trop complexes à prendre en main et trop précis. </p>

                    <p class="ft-xl-medium pv-20 ph-30 br-m bg-current-weak mv-30 n-ml-60 max-width-l n-ml-0@s ft-l-medium@s">"J'ai créé l'Arrière Boutique quand j'ai commencé à me sentir trop limité par les fonctionnalités d'Etsy"</p>

                    <p>C'est pourquoi j'ai commencé à développer une solution tout-en-un dédiée aux boutiques Etsy, qui rassemble des outils simples mais efficaces, sans perte de temps.</p>
                    
                    <button-base @click="onRegister" :modifiers="['ice']" class="mt-30">
                        Créer mon Arrière Boutique
                    </button-base>
                </div>
            </div>
        </div>

        <div class="Section5 is-precious bg-precious-xweak">
            <div class="Section5_wrapper fx-center Wrapper Wrapper--l pv-60 pv-40@s">
                <div class="Section5_left ft-l">
                    <h3 class="Title--l mb-20">Un projet <b class="ft-medium">en pleine création</b></h3>

                    <p>L'Arrière Boutique est en plein développement, c'est pourquoi de nombreuses fonctionnalités ne sont pas encore disponibles. Mais crois-moi, je travaille à fond pour te fournir les meilleurs outils français qui existent !</p>

                    <p class="ft-l-medium mt-40 color-current-xstrong">Un grand merci à toutes les boutiques qui soutiennent le projet.</p>

                    <div class="row-xs mt-20">
                        <div class="col-4 col-6@m col-12@s" v-for="shop in supportingShops" :key="shop._id">
                            <a :href="shop.link" class="Home_shop" target="_blank">
                                <img :src="shop.logo" width="40">
                                <div>
                                    <p class="ft-s-medium ellipsis-1 line-1">{{ shop.name }}</p>
                                    <p class="ft-s color-ft-weak ellipsis-1 line-1 mt-5">{{ $moment(shop.createdAt).fromNow() }}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    
                    <div class="text-center@s">
                        <button-base @click="onRegister" :modifiers="['precious']" class="mt-20 ">
                            Soutenir le projet
                        </button-base>
                    </div>
                </div>
                <div class="Section5_right fx-no-shrink ml-60 ml-0@s mt-40@s">
                    <div class="bg-bg-light p-20 br-m text-center">
                        <video class="mb-20 br-s" autoplay loop muted height="200">
                            <source :src="assets.catWork" type="video/mp4">
                        </video>
                    
                        <p class="ft-medium color-current-xstrong mb-5">Je travaille en ce moment sur...</p>

                        <p class="ft-s color-current-strong">Afficher ses avis Etsy sur sa page</p>
                        <p class="ft-s color-current-strong">Afficher une promotion en cours</p>

                        <p class="ft-medium color-current-xstrong mt-20 mb-5">Et ensuite sur...</p>

                        <p class="ft-s color-current-strong">Créer un jeu-concours sur sa page</p>
                        <p class="ft-s color-current-strong">Créer une bannière de boutique en 2 clics</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import video1 from '@/assets/video/landing-ambient-2.mp4'
import catWork from '@/assets/video/cat-work.mp4'
import france from '@/assets/img/brands/france.png'
import about from '@/assets/img/about/portrait_1.jpg'
import landing1 from '@/assets/img/landing/landing_1.png'
import landing2 from '@/assets/img/landing/landing_2.png'
import landing3 from '@/assets/img/landing/landing_3.png'
import landing4 from '@/assets/img/landing/landing_4.png'

export default {
    name: 'Homepage',
    components: { InputBase },
    async fetch () {
        this.shops = await this.$store.dispatch('shops/get', {
            query: {}
        })
    },
    data: () => ({
        assets: { video1, france, about, catWork },
        currentLanding: 0,
        shops: [],
        landings: [],
        formData: {
            email: ''
        }
    }),
    computed: {
        supportingShops () {
            return this.shops.filter(s => s.logo && s.name && s.link).sort((a, b) => this.$moment(b.createdAt).format('YYYYMMDD') - this.$moment(a.createdAt).format('YYYYMMDD')).slice(0, 6)
        }
    },
    mounted () {
        this.landings = [
            { id: 0, color: 'duck', background: 'https://images.pexels.com/photos/3817500/pexels-photo-3817500.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', landing: landing1 },
            { id: 1, color: 'gum', background: 'https://images.pexels.com/photos/8715545/pexels-photo-8715545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', landing: landing3 },
            { id: 2, color: 'ice', background: 'https://images.pexels.com/photos/7310197/pexels-photo-7310197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', landing: landing2 },
            { id: 3, color: 'emerald', background: 'https://images.pexels.com/photos/4348187/pexels-photo-4348187.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', landing: landing4 },
        ]
    },
    methods: {
        onRegister () {
            window.location.href = process.env.dashboardUrl + '/register?email=' + this.formData.email
        },
        nextLanding () {
            this.currentLanding = this.currentLanding >= this.landings.length - 1 ? 0 : this.currentLanding + 1
        }
    },
    head () {
        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: `J'ai créé l'Arrière Boutique pour te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.` }
            ]
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>

<style lang="scss" scoped>
    .HomePage {
        background-color: var(--color-pond-xweak);
    }

    .HomePage_section1 {
        display: flex;
        align-items: center;
    }

    .HomePage_section1right {
        margin-left: 40px;
        position: relative;
    }

    .HomePage_section1video {
        width: 400px;
        height: 520px;
        display: block;
    }

    .Section2 {
        background-color: var(--color-current-xweak);
        overflow: hidden;
        transition: all 350ms ease;
    }

    .Section2_left {
        padding-right: 40px;
    }

    .Macaron,
    .Macaron_2 {
        position: absolute;
        top: 50px;
        right: -50px;
    }

    .Macaron_2 {
        right: auto;
        left: -50px;
    }

    .Section2_right {
        width: 40%;
        min-width: 400px;
        max-width: 500px;
        position: relative;
    }

    .Section2_landing {
        display: block;
        position: absolute;
        z-index: 8;
        top: 50%;
        margin-top: -180px;
        left: -50px;
        height: 360px;
    }

    .Section2_image {
        background-size: cover;
        background-position: top center;

        &::before {
            content: "";
            display: block;
            padding-bottom: 130%;
        }
    }

    .Section2_arrow {
        position: absolute;
        color: var(--color-current-xstrong);
        top: 50%;
        right: -40px;
        font-size: 40px;
        z-index: 5;
        transform: translate3d(0, -50%, 0);
        padding: 20px;
        cursor: pointer;
        transition: transform 250ms ease-out;

        &:hover {
            transform: translate3d(10px, -50%, 0);
        }
    }

    .Section4_left {
        width: 50%;
        min-width: 400px;
        max-width: 500px;
        margin-right: 40px;
        position: relative;
    }

    .Section4_right {
        position: relative;
        z-index: 2;
    }

    .Section4_portrait {
        background-size: cover;
        background-position: top center;
        height: 100%;

        &::before {
            content: "";
            display: block;
            padding-bottom: 130%;
        }
    }

    .Home_shop {
        background: var(--color-bg-light);
        display: flex;
        align-items: center;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 10px;

        img {
            border-radius: 50%;
            margin-right: 10px;
        }
    }

    
    @include breakpoint-s {

        .HomePage_section1 {
            display: block;
        }

        .HomePage_section1right {
            margin: 0;
            border-radius: 10px;
            height: 250px;
            overflow: hidden;
        }

        .HomePage_section1video {
            object-fit: cover;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            left: 0;
        }

        .Macaron {
            top: 10px;
            right: 10px;
        }

        .Section2_wrapper,
        .Section4_wrapper {
            flex-direction: column-reverse;
        }

        .Section2_landing {
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            height: 360px;
        }

        .Section2_arrow {
            right: 40px;
        }

        .Section2_left {
            padding: 40px 0;
        }

        .Section2_right {
            width: 100%;
            max-width: 1000px;
            overflow: hidden;
            border-radius: 10px;
            margin-top: 20px;
        }

        .Section2_image {
            opacity: 0.5;
        }
            
        .Section4_left {
            width: auto;
            min-width: 0;
            max-width: 5000px;
            margin-right: 0;
            overflow: hidden;
            border-radius: 10px;
            margin-bottom: 40px;
        }

        .Macaron_2 {
            left: 10px;
        }

        .Section5_wrapper {
            flex-direction: column;
        }

    }
</style>