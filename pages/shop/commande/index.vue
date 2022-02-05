<template>
    <div class="pl-40">
        <form @submit.prevent="onSubmit">
            <div v-if="mode == 'logged'">
                <p class="ft-2xl-bold">Salut {{ user.name }} !</p>

                <input-base label="Adresse e-mail" type="text" class="is-disabled mt-20" v-model="form.email" :attrs="{ disabled: true }" />
            
                <div class="text-right mt-20">
                <button-base type="button" class="mr-10" :modifiers="['link']" @click="logOut">Ce n'est pas toi ?</button-base>
                    <button-base type="submit">Continuer</button-base>
                </div>
            </div>

            <div v-if="mode == 'register'">
                <p class="ft-2xl-bold">Je m'inscris</p>

                <register-form :no-submit="true" class="mt-20" @formChange="updateForm" />

                <div class="text-right mt-20">
                    <button-base type="button" class="mr-10" :modifiers="['link']" @click="mode = 'logIn'">Tu as déjà un compte ?</button-base>
                    <button-base type="submit">S'inscrire</button-base>
                </div>
            </div>

            <div v-if="mode == 'logIn'">
                <p class="ft-2xl-bold">Je me connecte</p>

                <input-base label="Adresse e-mail" type="email" class="mt-20 mb-10" :attrs="{ required: true }" v-model="form.email" />
                <input-base label="Mot de passe" type="password" :attrs="{ required: true }" v-model="form.password" />

                <div class="text-right mt-20">
                    <button-base type="button" class="mr-10" :modifiers="['link']" @click="mode = 'register'">Tu n'as pas de compte ?</button-base>
                    <button-base type="submit">Se connecter</button-base>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'OrderPage',
    layout: 'order',
    components: { InputBase },
    data: () => ({
        mode: 'register',
        errors: [],
        form: {
            name: '',
            email: '',
            password: '',
            shopCategory: '',
            shopCategoryCustom: '',
            shopName: '',
            newsletter: true
        }
    }),
    computed: {  
        user () { return this.$store.state.auth.user },
        order () { return this.$store.getters['order/get'] }
    },
    watch: {
        user: {
            immediate: true,
            async handler (v) {
                if (v) {
                    this.form = {
                        ...this.form,
                        email: v.email,
                    }

                    this.mode = v.role != 'guest' ? 'logged' : 'register'
                } else {
                    this.mode = 'register'
                }
            }
        } 
    },
    methods: {
        updateForm (v) {
            this.form = {
                ...this.form,
                ...v
            }
        },
        async logOut () {
            await this.$store.dispatch('user/logOut')
            await this.$store.dispatch('order/update', { _id: this.order._id })
        },
        async onSubmit () {
            const token = await this.$recaptcha.execute('login')

            this.errors = []

            try {
                if (this.mode != 'logged') {
                    const response = await this.$auth.loginWith('local', { 
                        data: { ...this.form, token, type: this.mode }
                    })

                    if (response.status != 200) throw response.errors
                }

                if (!this.user) throw ['no-user']
    
                await this.$store.dispatch('order/update', { _id: this.order._id })

                this.$router.push({ path: this.localePath({ name: 'commande-informations' }) })
            } catch (e) {
                console.error(e)
                this.errors = e
            }
        }
    }
}
</script>