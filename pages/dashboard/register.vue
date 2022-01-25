<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-3xl-bold mv-40">Bonjour ! <i class="ml-5 fal fa-sparkles"></i></p>

            <popin-base :is-active="isPopinActive" :modifiers="['absolute-header', 'hide-close', 'pond', 'm']">
                <template slot="content">
                    <slider-block @next="step += 1" @prev="step -= 1" :step="step" item-class="p-40" :hide-footer="step == 2">
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

                            <p class="ft-m-medium mv-10">Pour profiter au mieux de ton Arrière Boutique, je te conseille fortement de connecter ta boutique Etsy.</p>

                            <p class="color-ft-weak mv-10">Certaines fonctionnalités ne seront pas disponibles sans cette action de ta part.</p>

                            <div class="text-center br-m mt-30 p-30 bg-ice-xweak">
                                <button-base icon-before="plus" :modifiers="['ice']" @click="connectShop">Connecter une boutique</button-base>
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

                            <button-base type="button" :modifiers="['xs', 'secondary']" @click="step = 3" :class="{ 'is-loading': isLoading }" v-if="step == 1 && isSkippable">
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
                <div class="cell-width-8">
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
                <div class="cell-width-4 cell-height-2">
                    <div class="Tile bg-gum-xweak">

                    </div>
                </div>
                <div class="cell-width-4">
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
                <div class="cell-width-4">
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
            
            setTimeout(() => this.isPopinActive = true, 1000)
            setTimeout(() => this.isSkippable = true, 5000)

            if (this.$route.query.token) {
                this.isLoading = true
                this.step = 2

                setTimeout(() => {
                    if (this.isLoading) this.step = 3
                }, 6000)

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

            const token = await this.$recaptcha.execute('login')
            const response = await this.$auth.loginWith('local', { 
                data: { ...this.formData, token, type: 'register' }
            })

            if (response.data.status != 1) {
                this.errors = response.data.errors
            } else {
                this.step += 1
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