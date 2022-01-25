<template>
    <div class="HomePage">
        <div class="HomePage_section1 is-pond Wrapper Wrapper--m">
            <div class="fx-grow">
                <div class="max-width-m">
                    <h1 class="ft-4xl line-2 color-pond-xstrong">Prends soin de tes clients, <b>on s'occupe du reste</b></h1>
                    
                    <h2 class="ft-xl-medium color-ft mt-30">Simplifie-toi la gestion de ta boutique Etsy, passe plus de temps à créer <i class="fal fa-sparkles ml-3"></i></h2>

                    <form class="d-flex mt-30" @submit.prevent="onRegister">
                        <input-base type="email" label="Ton adresse e-mail" v-model="formData.email" />

                        <button-base type="submit" class="ml-20" :modifiers="[]">
                            C'est parti !
                        </button-base>
                    </form>
                </div>
            </div>

            <div class="HomePage_section1right">
                <video class="HomePage_section1video" autoplay loop>
                    <source :src="assets.video1" type="video/mp4">
                </video>

                <macaron class="Macaron is-ice" name="label/france">
                    <img :src="assets.france" width="20" class="d-block">
                </macaron>
            </div>
        </div>

        <div class="Section2" :class="[ `is-${landings[currentLanding].color}` ]" v-if="landings[currentLanding]">
            <div class="Section2_wrapper fx-center Wrapper Wrapper--m">
                <div class="Section2_left">
                    <h2 class="ft-4xl color-current-xstrong line-2">Crée aujourd'hui <b class="ft-medium">la page qui te ressemble</b>, en quelques clics</h2>

                    <p class="ft-l mt-20">Les plateformes comme Etsy souvent trop limitées en personnalisation. Immerge tes clients dans TON univers avant de les diriger vers l'achat.</p>

                    <p class="Tag Tag--l mt-40">C'est gratuit.</p>
                </div>
                <div class="Section2_right">
                    <transition-group name="fade-h">
                        <div class="Section2_image" v-for="landing in landings" :style="{ backgroundImage: `url(${landing.background})` }" :key="landing.id" @click="nextLanding" v-show="landing.id == currentLanding"></div>
                    </transition-group>

                    <i class="Section2_arrow fal fa-long-arrow-right" @click="nextLanding"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import video1 from '@/assets/video/landing-ambient-2.mp4'
import france from '@/assets/img/brands/france.png'

export default {
    name: 'Homepage',
    components: { InputBase },
    data: () => ({
        assets: { video1, france },
        currentLanding: 0,
        landings: [],
        formData: {
            email: ''
        }
    }),
    mounted () {
        this.landings = [
            { id: 0, color: 'gum', background: 'https://images.pexels.com/photos/8715545/pexels-photo-8715545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
            { id: 1, color: 'duck', background: 'https://images.pexels.com/photos/3817500/pexels-photo-3817500.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
            { id: 2, color: 'ice', background: 'https://images.pexels.com/photos/7310197/pexels-photo-7310197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
            { id: 3, color: 'emerald', background: 'https://images.pexels.com/photos/4348187/pexels-photo-4348187.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
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

    .Macaron {
        position: absolute;
        top: 50px;
        right: -50px;
    }

    .Section2_right {
        width: 40%;
        min-width: 400px;
        max-width: 500px;
        position: relative;
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
</style>