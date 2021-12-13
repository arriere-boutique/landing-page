<template>
    <div class="GoPage">
        <div class="GoPage_container">
            <a href="https://arriere-boutique.fr">
                <img :src="assets.banner" width="100%" class="br-4" >
            </a>

            <p class="ft-l-bold mv-20">Reçois en avant-première le TP n°1 de l'Arrière Boutique !</p>

            <p class="mv-20">
                Les TPs, ce sont des mini-projets concrets qui font avancer ta boutique. Des exercices ludiques, de nombreux exemples et toujours un peu de théorie pour vraiment faire la différence. 
                <br><br>
                <b>Le thème de ce TP : Comprendre à qui l'on s'adresse pour vendre mieux.</b> Au cours de ce projet (6 exercices), nous allons explorer les types de personnes à qui tu vends pour construire un persona.
            </p>

            <p class="p-20 bg-gum-xweak br-10 mv-20">
                <b class="color-gum">5 créateurs & créatrices seront sélectionné·e·s aléatoirement pour recevoir leur TP gratuitement.</b><br>Pour participer, tu acceptes de compléter les exercices (compter environ 1h30), ainsi qu'un questionnaire pour donner ton avis général. 
            </p>

            <p class="p-20 bg-precious-xweak br-10 mt-10" v-show="state.isSuccess">
                <b class="color-precious">Ta participation a été prise en compte !</b> Tu recevras un mail très prochainement si tu as été sélectionné·e. À plus !
            </p>
            
            <form @submit.prevent="onSubmit" v-show="!state.isSuccess">
                <emailing-form type="s" :no-submit="true" @formChange="onChange" />

                <label class="ft-s d-flex p-15 br-10 bg-gum-xweak">
                    <input type="checkbox" required>

                    <p class="ft-medium ml-10 n-mt-3">Je m'abonne gratuitement à la newsletter pour <span class="color-gum">recevoir guides, astuces & offres pour améliorer ma boutique</span>.</p>
                </label>

                <label class="ft-s d-flex p-15 br-10 mt-10 bg-precious-xweak">
                    <input type="checkbox" required>

                    <p class="ft-medium ml-10 n-mt-3">Si je suis sélectionné·e, j'accepte de donner mon avis au travers d'un questionnaire écrit qui me sera envoyé par mail.</p>
                </label>

                <p v-for="error in state.errors" :key="error">
                    {{ $t(`EmailingForm.errors.${error}`) }}
                </p>

                <div class="mt-10 text-right">
                    <button-base type="submit" :icon-before="state.isLoading ? '' : 'party-horn'" :class="{ 'is-disabled': state.isSuccess || state.isLoading }">
                        {{ state.isLoading ? 'Une petite seconde...' : (state.isSuccess ? `C'est tout bon !` : `Je participe`) }}
                    </button-base>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import banner from '@/assets/img/animated/tp-banner.gif'

export default {
    name: 'TravauxPratiques',
    layout: 'blank',
    data: () => ({
        assets: { banner },
        state: {
            isSuccess: false,
            isLoading: false,
            errors: []
        },
        formData: {
            email: '',
            name: '',
            shopName: '',
            shopCategory: 0,
            shopCategoryCustom: ''
        }
    }),
    methods: {
        onChange (v) {
            this.formData = v
        },
        async onSubmit () {
            this.state.isLoading = true
            this.state.isSuccess = false
            this.state.errors = []

            const token = await this.$recaptcha.execute('login')

            try {
                let response = await this.$store.dispatch('subscribe/create', {
                    ...this.formData,
                    shopCategory: this.formData.shopCategory + 1,
                    listIds: [6, 7],
                    token
                })

                this.state.isSuccess = true
                this.state.isLoading = false
            } catch (e) {
                this.state.errors = e
                this.state.isLoading = false
            }
        }
    },
    head () {
        let meta = {}
        return meta
    }
}
</script>