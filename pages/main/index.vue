<template>
    <div class="HomePage">
        <div class="HomePage_section1 Wrapper pv-60">
            <div class="fx-grow">
                <h1 class="ft-3xl-bold color-pond-strong">Prends soin de tes clients, on s'occupe du reste</h1>
                <h2 class="ft-xl-medium color-ft mt-30">Simplifie-toi la gestion de ta boutique Etsy, passe plus de temps à créer <i class="fal fa-sparkles ml-3"></i></h2>

                <form class="d-flex mt-30">
                    <input-base label="Ton adresse e-mail" v-model="formData.email" />

                    <button-base type="submit" class="ml-20" :modifiers="[]">
                        C'est parti !
                    </button-base>
                </form>
            </div>

            <div class="HomePage_section1right">
                <video class="HomePage_section1video" autoplay loop>
                    <source :src="assets.video1" type="video/mp4">
                </video>
            </div>
        </div>

        <div class="Section2 bg-gum-xweak" :style="{ '--background-image': `url(${content.customization['background']})`, '--background-color': content.customization['background-color'], '--opacity': (opacity / 100) }">
            <div class="Section2_wrapper Wrapper pv-60">
                <div class="Section2_left">
                    <div class="">
                        <div class="Section2_phone">
                            <landing-content class="Section2_landing" :content="content" :is-preview="true" />
                        </div>

                        <div class="d-flex fx-wrap mt-20 fx-justify-center">
                            <div class="BackgroundSwatch m-3" v-for="(bg, i) in BACKGROUNDS" :style="{ backgroundImage: `url(${bg.src})` }" @click="selected = i" :key="i">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Section2_right">
                    <h2 class="ft-3xl-bold">Restons simples.</h2>
                    <h3 class="ft-xl-medium color-ft mt-5">
                        Personne n'aime perdre du temps à comprendre des outils trop complexes.
                    </h3>

                    <p class="ft-m-medium color-ft mt-40">
                        Crée ta page d'accueil personnalisée en quelques clics et permet à tes clients de te trouver en un clin d'oeil.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import video1 from '@/assets/video/landing-ambient-1.mp4'

const BACKGROUNDS = [
    { src: 'https://images.pexels.com/photos/5176378/pexels-photo-5176378.png?auto=compress&cs=tinysrgb&h=650&w=940', color: '#efe0cd' },
    { src: 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', color: '#457451' },
    { src: 'https://images.pexels.com/photos/6805801/pexels-photo-6805801.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', color: '#ffbcb6' },
    { src: 'https://images.pexels.com/photos/1580226/pexels-photo-1580226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', color: '#ffdda1' }
]

export default {
    name: 'Homepage',
    components: { InputBase },
    data: () => ({
        BACKGROUNDS,
        assets: { video1 },
        selected: 0,
        opacity: 20,
        formData: {
            email: ''
        }
    }),
    computed: {
        content () {
            let items = [
                {
                    title: 'Bienvenue dans mon univers',
                    links: [
                        { id: 1, label: 'Ma boutique Etsy', href: '#', active: true },
                        { id: 2, label: 'Suis-moi sur Instagram', href: '#', active: true },
                        { id: 3, label: 'Ma newsletter', href: '#', active: true },
                    ],
                    logo: '',
                }, {
                    title: `La Savonnerie Marceline`,
                    links: [
                        { id: 1, label: 'Savonnerie bio & éthique', href: '#', active: true },
                        { id: 3, label: 'LA PROMO DU MOIS', href: '#', active: true },
                    ],
                    logo: '',
                }, {
                    title: `Accessoires en laine 100% française`,
                    links: [
                        { id: 1, label: 'La boutique', href: '#', active: true },
                        { id: 3, label: 'Qui suis-je ?', href: '#', active: true },
                    ],
                    logo: '',
                }, {
                    title: `S'aimer un jour, toujours`,
                    links: [
                        { id: 1, label: 'Bijoux Made in France', href: '#', active: true },
                        { id: 2, label: 'Mes idées cadeau', href: '#', active: true },
                        { id: 3, label: '-50% sur les bracelets', href: '#', active: true },
                    ],
                    logo: '',
                }
                
            ]
            return {
                ...items[this.selected],
                customization: {
                    'background': BACKGROUNDS[this.selected].src,
                    'background-thumbnail': BACKGROUNDS[this.selected].src,
                    'background-color': BACKGROUNDS[this.selected].color,
                    'background-opacity': this.opacity
                }
            }
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
        width: 350px;
        margin-left: 40px;
    }

    .HomePage_section1video {
        width: 350px;
        height: 350px;
        border: 8px solid var(--color-bg-light);
        border-radius: 15px;
        overflow: hidden;
    }

    .Section2 {
        background-color: var(--background-color);
        overflow: hidden;
        position: relative;

        &::before {
            content: "";
            display: block;
            width: 110%;
            height: 110%;
            position: absolute;
            top: -5%;
            left: -5%;
            background-image: var(--background-image);
            background-position: center;
            background-size: cover;
            opacity: calc(var(--opacity) * 0.5);
            filter: blur(10px);
            transition: all 300ms ease;
        }
    }

    .Section2_wrapper {
        display: flex;
        align-items: center;
        min-height: 500px;
        position: relative;
        z-index: 5;
    }

    .Section2_left {
        width: 50%;
        min-width: 300px;
        margin: 0 auto;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .Section2_right {
        max-width: 450px;
    }

    .Section2_phone {
        width: 280px;
        margin: 0 auto;
        background: linear-gradient(107deg, #ffffff 0%, #f5f5f5 22%, #e7e7e7 50%, #ededed 65%, #e9e9e9 75%, #e7e7e7 100%);
        border-radius: 25px;
        box-shadow: -14px 16px 18px 0 rgba(0, 0, 0, 0.15);
        position: relative;

        &::after {
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            position: absolute;
            top: 24px;
            left: 24px;
            background-color: #979797;
            border: 3px solid #e7e7e7;
            z-index: 3;
        }

        &::before {
            content: "";
            display: block;
            padding-bottom: 185%;
        }
    }
    
    .Section2_landing {
        position: absolute !important;
        top: 10px;
        left: 10px;
        width: calc(100% - 20px) !important;
        height: calc(100% - 20px) !important;
        border-radius: 20px;
        border: 1px solid #cdcdcd;
    }

    .BackgroundSwatch {
        width: 45px;
        height: 45px;
        border-radius: 5px;
        background-size: cover;
        background-position: center;
        cursor: pointer;
        transition: all 200ms ease;

        &:hover {
            opacity: 0.5;
            transform: scale(0.95);
        }
    }

</style>