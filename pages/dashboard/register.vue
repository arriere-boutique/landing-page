<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-3xl-bold mv-40">Bonjour ! <i class="ml-5 fal fa-sparkles"></i></p>

            <popin-base :is-active="isPopinActive" :modifiers="['absolute-header', 'pond', 'm']">
                <template slot="content">
                    <div class="p-40">
                        <slider-block>
                            <template slot="step1">
                                <form @submit.prevent="submitForm" v-if="step == 0">
                                    <p class="ft-xl-bold mb-30">J'ai juste besoin de quelques infos supplémentaires <i class="fal fa-cat ml-3"></i></p>

                                    <register-form :no-submit="true" :initial-data="initData" @formChange="updateForm" />
                                    
                                    <errors :items="errors" class="mt-10"/>

                                    <div class="text-right mt-10">
                                        <button-base type="submit" :modifiers="['gum']" :class="{ 'is-loading': isLoading }">
                                            Valider
                                        </button-base>
                                    </div>
                                </form>
                            </template>
                            <template slot="step2">
                                Bitch
                            </template>
                            <template slot="step3">
                                Bitch
                            </template>
                        </slider-block>
                    </div>
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
    middleware: 'loggedIn',
    layout: 'dashboard',
    data: () => ({
        isPopinActive: false,
        errors: [],
        step: 0,
        isLoading: false,
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
    mounted () {
        this.initData = { ...this.initData, email: this.$route.query.email }
        setTimeout(() => this.isPopinActive = true, 1000)
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
        }
    }
}
</script>

<style lang="scss" scoped>
</style>