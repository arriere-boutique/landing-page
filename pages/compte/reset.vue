<template>
    <div class="bg-gum-xweak o-hidden">
        <div class="Wrapper Wrapper--xs">
            
            <div class="mv-150 bg-bg-light br-s p-30">
                <p class="ft-xl-bold">Créer un nouveau mot de passe</p>

                <div class="text-center" v-if="isSuccess">
                    <p class="mv-20">Mot de passe modifié avec succès. Tu peux maintenant retenter de te connecter :</p>

                    <button-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'compte-login' }) }">
                        Se connecter
                    </button-base>
                </div>
                <form @submit.prevent="submitForm()" v-else>

                    <input-base
                        label="Nouveau mot de passe" 
                        class="mv-20"
                        type="password"
                        :helpers="['reveal']"
                        :validator="$validator('password')"
                        :attrs="{ autocomplete: 'new-password' }"
                        v-model="formData.password"
                    />

                    <div class="text-right">
                        <button-base type="submit" :class="{ 'is-loading': isLoading, 'is-disabled': !formData.password }">
                            Confirmer
                        </button-base>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'

export default {
    name: 'ResetPasswordPage',
    components: { InputBase, SelectBase },
    layout: 'default',
    middleware: 'loggedIn',
    data: () => ({
        isLoading: false,
        isSuccess: false,
        formData: {
            password: '',
            token: ''
        }
    }),
    mounted () {
        if (!this.$route.query.token) this.$router.push(this.localePath({ name: 'compte-login' }))

        this.formData.token = this.$route.query.token
    },
    methods: {
        async submitForm () {
            this.isLoading = true

            try {
                const response = await this.$store.dispatch('user/resetPassword', this.formData)

                if (response.status == 1) this.isSuccess = true
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style>

</style>