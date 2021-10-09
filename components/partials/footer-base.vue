<template>
    <footer class="FooterBase">
        <div class="bg-skylight-xweak pv-30" v-if="!isShop">
            <div class="Wrapper">
                <div class="d-flex fx-align-center d-block@s">
                    <div class="p-relative fx-no-shrink mr-10 mb-20@s">
                        <p class="marker ft-hand-xl color-precious mt-40 n-ml-10 ml-20@s mt-30@s">Salut !</p>
                        <img :src="assets.blobHelp" width="200" />
                    </div>

                    <div class="ft-l ml-20">
                        <p class="ft-2xl-bold color-precious mb-10">Besoin d'un coup de main ?</p>

                        <p class="mb-20">
                            <b>Soyons sérieux !</b> Développer une marque et commencer à vivre de ses créations prend du temps et beaucoup d'efforts. Je n'ai aucun intérêt à te vendre du rêve. Mais je suis là pour t'aider à faire rêver à tes clients grâce à tes créations originales.
                        </p>

                        <button-base
                            :modifiers="['precious', 'icon-mango']"
                            iconBefore="sparkles"
                            tag="nuxt-link"
                            :attrs="{ to: localePath({ name: 'shop' }) }"
                            text="Ouiii, ça m'intéresse !"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-pond-xweak pv-60">
            <div class="Wrapper Wrapper--s">
                <div class="bg-bg-light p-30 b">
                    <p class="ft-hand-s color-pond">
                        La Gazette de L'Arrière Boutique
                    </p>

                    <p class="mt-10 mb-30">Toutes les infos qui vont faire <b>avancer ta boutique</b> directement livrées dans ta boîte mail ! C'est pas beau la technologie ?</p>

                    <div class="row-xs fx-align-center">
                        <div class="col-6 col-12@xs">
                            <input-base label="Ton adresse e-mail" v-model="formData.email" type="text" />
                        </div>
                        <div class="col-6 col-12@xs mt-15@xs d-flex fx-align-center d-block@xs">
                            <label class="InputChoice mr-15">
                                <input type="radio" name="frequency" @click="formData.frequency = true" :checked="formData.frequency"> Dès que possible <i class="fal fa-question-circle fa-sm ml-5" @mouseenter="(e) => tooltipOpen('Reçois les dernières infos, guides et astuces dès que ça sort !', e)" @mouseleave="tooltipClose"></i>
                            </label>
                            <label class="InputChoice mt-15@xs">
                                <input type="radio" name="frequency" @click="formData.frequency = false" :checked="!formData.frequency"> Mensuel <i class="fal fa-question-circle fa-sm ml-5" @mouseenter="(e) => tooltipOpen('Le concentré de toutes les nouveautés du mois.', e)" @mouseleave="tooltipClose"></i>
                            </label>
                        </div>
                    </div>

                    <hr class="Separator mv-30">
                    
                    <div class="d-flex fx-align-center d-block@xs text-center@xs">
                        <p class="fx-grow ft-xs-medium color-ft mr-10 mr-0@xs mb-10@xs">Aucun spam, désabonnement possible à tout moment. C'est promis.</p>

                        <button-base @click="onSubmit">Je m'abonne GRATUITEMENT</button-base>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-gum-xweak">
            <div class="FooterBase_nav Wrapper Wrapper--l">
                <div class="FooterBase_links fx-grow row-xs">
                    <div class="col-6 pv-60 col-12@s pv-20@s" v-for="(item, i) in items" :key="i">
                        <p class="ft-m-bold">{{ item.label }}</p>

                        <div class="FooterBase_navLink" v-for="(link, j) in item.items" :key="j">
                            <nuxt-link class="link" :to="link.path" v-if="link.path">
                                {{ link.label }}
                            </nuxt-link>
                            <a class="link" :href="link.href" target="_blank" v-else>
                                {{ link.label }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="FooterBase_brand">
                    <nuxt-link class="d-block" :to="localePath({ name: '/' })">
                        <p class="ft-hand-s color-pond">L'Arrière Boutique</p>
                    </nuxt-link>

                    <div class="Title_secondary Title_secondary--s color-ft mv-60">
                        Le seul endroit où vos rêves sont impossibles, c'est dans votre tête
                        <p class="color-pond mt-20">R. Schuller</p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-center">
                        <a class="FooterBase_socials fill-pond" href="https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg" target="_blank">
                            <icon-base name="brands/youtube" :width="22" />
                        </a>

                        <a class="FooterBase_socials fill-pond"  href="https://www.facebook.com/groups/etsy.en.france" target="_blank">
                            <icon-base name="brands/facebook" :width="20" />
                        </a>

                        <a class="FooterBase_socials fill-pond"  href="https://www.instagram.com/arriereboutiquefr" target="_blank">
                            <icon-base name="brands/instagram" :width="16" />
                        </a>

                        <a class="FooterBase_socials fill-pond"  href="https://www.etsy.com/fr/shop/ArriereBoutiqueFr" target="_blank">
                            <icon-base name="brands/etsy" :width="12" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import { InputBase } from '@instant-coffee/core'
import blobHelp from '@/assets/img/blob/blob-help.jpg'

export default {
    name: 'FooterBase',
    components: { InputBase },
    props: {
        isShop: { type: Boolean, default: false }
    },
    data: () => ({
        assets: { blobHelp },
        items: [
            { label: `Apprenons ensemble !`, items: [
                { label: `Apprendre sur Youtube`, href: "https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg" },
                { label: `Me suivre sur Instagram`, href: "https://www.instagram.com/arriereboutiquefr" },
                { label: `Rejoindre notre groupe d'entraide`, href: "https://www.facebook.com/groups/etsy.en.france" },
            ] },
            { label: "À propos", items: [

            ] }
        ],
        formData: {
            email: '',
            frequency: true
        }
    }),
    methods: {
        async onSubmit () {
            const token = await this.$recaptcha.execute('login')

            let response = await this.$store.dispatch('subscribe/create', {
                ...this.$data.formData,
                frequency: this.$data.formData.frequency ? 'biweekly' : 'monthly',
                token
            })

            console.log(response)
        }
    }
}
</script>