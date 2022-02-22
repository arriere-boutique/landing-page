<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-3xl-bold mv-40">Bonjour ! <i class="ml-5 fal fa-sparkles"></i></p>

            <popin-base :is-active="isPopinActive" :modifiers="['absolute-header', 'hide-close', 'pond', 'm']">
                <template slot="content">
                    <slider-block @next="step += 1" @prev="step -= 1" :step="step" item-class="p-40 p-30@s" :hide-footer="step == 2">
                        <template slot="step1">
                            <form id="register" @submit.prevent="submitForm">
                                <p class="ft-xl-bold mb-30">J'ai juste besoin de quelques infos supplémentaires <i class="fal fa-cat ml-3"></i></p>

                                <register-form
                                    :no-submit="true"
                                    :initial-data="initData"
                                    @formChange="updateForm"
                                />
                                
                                <errors :items="errors" class="mt-10"/>
                            </form>
                        </template>
                        <template slot="step2">
                            <p class="ft-xl-bold mb-30">Ravi de te rencontrer, {{ formData.name }}. <i class="fal fa-sparkles ml-3"></i></p>

                            <p class="ft-m-medium mv-10">Pour profiter au mieux de ton Arrière Boutique, connecte dès maintenant ta boutique Etsy !</p>

                            <div class="text-center br-m mt-30 p-30 bg-ice-xweak">
                                <button-base icon-before="plus" :modifiers="['ice']" @click="connectShop">Connecter ma boutique</button-base>

                                <div class="mt-20 color-ice-xstrong">
                                    <div class="round bg-bg-light"><i class="fal fa-lock"></i></div>
                                    <p class="ft-m-medium mt-5">Cette connexion est sécurisée par Etsy</p>

                                    <p class="ft-s mt-5">Elle ne donne pas accès à tes informations sensibles (mot de passe, compte bancaire...) et tu gardes le contrôle total sur tes actions.</p>
                                </div>
                            </div>
                        </template>
                        <template slot="step3">
                            <placeholder :modifiers="['h']" class="br-m">
                                <p class="ft-m-bold mt-10">Synchronisation de ta boutique en cours</p>
                                <p class="ft-s mt-5">Patience, cela peut prendre quelques minutes...</p>
                            </placeholder>
                        </template>
                        <template slot="step4">
                            <p class="ft-xl-bold mb-30">Génial, c'est tout bon ! Il est temps de te familiariser avec ton nouvel espace <i class="fal fa-home-heart ml-3"></i></p>
                        </template>
                        <template slot="submit">
                            <button-base type="submit" :attrs="{ form: 'register' }" :modifiers="['gum']" :class="{ 'is-loading': isLoading }" v-if="step == 0">
                                Valider
                            </button-base>
                            
                            <p class="ft-xs-medium text-right color-ft-weak mh-10 d-none@s" v-if="step == 1 && isSkippable">Certaines fonctionnalités ne seront pas disponibles</p>

                            <button-base type="button" :modifiers="['xs', 'secondary']" @click="step = 3" :class="{ 'is-loading': isLoading || !isSkippable }" v-if="step == 1">
                                Ignorer cette étape
                            </button-base>

                            <button-base :modifiers="['gum']" @click="step = 4" v-if="step == 3">
                                Je découvre mon Arrière Boutique
                            </button-base>
                        </template>
                    </slider-block>
                </template>
            </popin-base>

            <div class="Grid">
                <div class="cw-8 cw-12@s">
                    <div class="Tile fx-align-end bg-gum-xweak">
                        <div>
                            <i class="fal fa-xl fa-sparkles"></i>

                            <p class="ft-xl-bold mv-15">
                                Seuls ceux qui prendront le risque d'aller trop loin découvriront jusqu'où on peut aller.
                            </p>

                            <p class="ft-hand-2xs">thomas Stearns eliot</p>
                        </div>
                    </div>
                </div>
                <div class="cw-4 ch-2 cw-12@s">
                    <div class="Tile bg-gum-xweak">

                    </div>
                </div>
                <div class="cw-4 cw-12@s">
                    <div class="Tile fx-dir-column fx-justify-between bg-emerald-xweak">
                        <div>
                            <i class="fal fa-lg fa-coin"></i>

                            <p class="ft-xl-bold">Profit estimé</p>
                            <p class="ft-s-medium text-uppercase">30 derniers jours</p>
                        </div>

                        <p class="ft-4xl-bold mt-20">
                            {{ getTotalProfit() }}<span class="ft-xl-bold">€</span>
                        </p>
                    </div>
                </div>
                <div class="cw-4 cw-12@s">
                    <div class="Tile fx-dir-column fx-justify-between bg-precious-xweak">
                        <div>
                            <i class="fal fa-lg fa-box"></i>

                            <p class="ft-xl-bold">Commandes</p>
                            <p class="ft-s-medium text-uppercase">30 derniers jours</p>
                        </div>

                        <p class="ft-5xl-bold mt-20">
                            {{ getOrderCount() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'DashboardRegister',
    components: { InputBase, ToggleBase },
    layout: 'dashboard',
    data: () => ({
        isPopinActive: false,
        errors: [],
        step: 0,
        isLoading: false,
        isSkippable: false,
        initData: {
            email: ''
        },
        formData: {
            email: '',
            password: '',
            name: '',
            newsletter: true
        }
    }),
    computed: {  
        user () { return this.$store.state.auth.user },
    },
    async mounted () {
        if (!this.user || this.user.role == 'guest' || this.user.shops.length <= 0) {
            this.initData = { ...this.initData, email: this.$route.query.email }
            
            setTimeout(() => this.isPopinActive = true, 500)

            if (this.$route.query.token) {
                this.isPopinActive = true
                this.isLoading = true
                this.step = 2

                setTimeout(() => {
                    if (this.isLoading) this.step = 3
                }, 12000)

                try {
                    let refresh = this.$route.query.refresh

                    let response = await this.$store.dispatch('shop/create', {
                        etsyId: this.$route.query.token.split('.')[0],
                        etsyToken: this.$route.query.token,
                        etsyRefresh: refresh
                    })

                    this.$auth.fetchUser()

                    this.step = 3
                    this.isLoading = false
                } catch (e) {
                    this.step = 1
                    this.isLoading = false
                }
            }

            if (this.user && this.user.role != 'guest') {
                this.step = 1

                setTimeout(() => {
                    this.formData = { ...this.formData, ...this.user }
                }, 500)
            }
        } else {
            this.$router.push(this.localePath({ name: 'index' }))
        }
    },  
    watch: {
        step (v) {
            if (v == 1) {
                this.isSkippable = false
                setTimeout(() => this.isSkippable = true, 10000)
            }

            if (v == 4) this.$router.push(this.localePath({ name: 'index' }))
        }
    },
    methods: {
        getOrderCount (limit = 30, unit = 'days') {
            return 47
        },
        getTotalProfit (limit = 30, unit = 'days') {
            return 560.33
        }, 
        updateForm (v) {
            this.formData = {
                ...this.formData,
                ...v
            }
        },
        async submitForm () {
            this.errors = []
            this.isLoading = true

            try {
                const token = await this.$recaptcha.execute('login')
                const response = await this.$auth.loginWith('local', { 
                    data: { ...this.formData, token, type: 'register' }
                })

                if (response.data.status != 1) {
                    this.errors = response.data.errors
                } else {
                    this.step += 1
                }
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        async connectShop () {
            let response = await this.$store.dispatch('shop/auth', window.location.href.split('?')[0])
            if (response) window.location = response
        }
    }
}
</script>

<style lang="scss" scoped>
</style>