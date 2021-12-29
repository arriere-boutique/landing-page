<template>
    <div>
        <div class="Wrapper pv-60">
            <div class="row-xs">
                <div class="col-6">
                    <div class="p-30 bg-bg-light">
                        <p class="ft-2xl-bold">Se connecter</p>

                        <form @submit.prevent="submitForm('login')" class="mt-20">
                            <input-base label="Ton adresse e-mail" class="mb-10" :attrs="{ required: true }" v-model="loginForm.email" type="email" />

                            <input-base label="Mot de passe" class="mb-20" type="password" v-model="loginForm.password" />

                            <div class="text-right">
                                <button-base type="submit" :modifiers="['secondary']" :class="{ 'is-disabled': state.isSuccess || state.loading }">
                                    Je me connecte
                                </button-base>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-6">
                    <form autocomplete="off" @submit.prevent="submitForm('register')" class="p-30 bg-bg-light">
                        <p class="ft-2xl-bold">Nous rejoindre</p>

                        <register-form :no-submit="true" class="mv-20" @formChange="updateForm" />

                        <div class="text-right">
                            <button-base type="submit" :class="{ 'is-disabled': state.isSuccess || state.loading }">
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
import { InputBase, SelectBase } from '@instant-coffee/core'

export default {
    name: 'LoginPage',
    components: { InputBase, SelectBase },
    layout: 'shop',
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
                this.$router.push({ path: this.localePath({ name: 'compte' }) });
            }
        }
    }
}
</script>

<style>

</style>