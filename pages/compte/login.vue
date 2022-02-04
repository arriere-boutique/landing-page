<template>
    <div class="bg-bg-light o-hidden">
        <div class="Wrapper Wrapper--m">
            <div class="row-xl">
                <div class="col-6 pv-60 col-12@s pv-20@s">
                    <div class="pv-30 br-m">
                        <p class="ft-2xl-bold"><i class="fal fa-sparkles mr-5"></i> Se connecter</p>

                        <form @submit.prevent="submitForm('login')" class="mt-30">
                            <input-base label="Ton adresse e-mail" class="mb-10" :attrs="{ required: true }" v-model="loginForm.email" type="email" />

                            <input-base label="Mot de passe" class="mb-10" type="password" v-model="loginForm.password" />

                            <errors :items="loginErrors" />

                            <div class="text-right mt-10">
                                <link-base class="mr-5">Mot de passe oublié ?</link-base>

                                <button-base type="submit" :modifiers="['secondary']" :class="{ 'is-disabled': state.isSuccess || state.loading }">
                                    Je me connecte
                                </button-base>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-6 pv-60 p-relative col-12@s">
                    <div class="bg-to-right bg-gum-xweak"></div>

                    <form autocomplete="off" @submit.prevent="submitForm('register')" class="p-30 bg-bg-light br-m p-relative">
                        <p class="ft-2xl-bold"><i class="fal fa-hand-wave mr-5"></i> Crée ton Arrière Boutique</p>

                        <register-form :no-submit="true" class="mt-30" @formChange="updateForm" />

                        <errors :items="registerErrors" class="mt-10"/>

                        <div class="text-right mt-10">
                            <button-base type="submit" :modifiers="['gum']" :class="{ 'is-disabled': state.isSuccess || state.loading }">
                                Je m'inscris
                            </button-base>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'

export default {
    name: 'LoginPage',
    components: { InputBase, SelectBase },
    layout: 'default',
    middleware: 'loggedIn',
    data: () => ({
        state: {
            isSuccess: false,
            loading: false
        },
        loginErrors: [],
        loginForm: {
            email: '',
            password: ''
        },
        registerErrors: [],
        registerForm: {}
    }),
    methods: {
        updateForm (v) {
            this.registerForm = {
                ...this.registerForm,
                ...v
            }
        },
        async submitForm (type) {
            this.loginErrors = []
            this.registerErrors = []

            const token = await this.$recaptcha.execute('login')

            const response = await this.$auth.loginWith('local', { 
                data: { ...(type == 'register' ? this.registerForm : this.loginForm), token, type }
            })

            if (response.data.status != 1) {
                if (type == 'login') {
                    this.loginErrors = response.data.errors
                } else {
                    this.registerErrors = response.data.errors
                }
            } else {
                this.$router.push({ path: this.localePath({ name: 'dashboard' }) });
            }
        }
    }
}
</script>

<style>

</style>