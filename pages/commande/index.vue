<template>
    <div class="pl-40">
        <form @submit.prevent="onSubmit">
            <div v-if="mode == 'logged'">
                <p class="ft-2xl-bold">Salut {{ user.name }} !</p>
                <button-base type="button" :modifiers="['link']" @click="logOut">Ce n'est pas toi ?</button-base>

                <input-base label="Adresse e-mail" type="text" class="is-disabled mt-20" v-model="form.email" :attrs="{ disabled: true }" />
            </div>

            <div v-if="mode == 'register'">
                <p class="ft-2xl-bold">Je m'inscris</p>
                <button-base type="button" :modifiers="['link']" @click="mode = 'logIn'">Tu as déjà un compte ?</button-base>

                <input-base label="Adresse e-mail" type="text" class="mb-10 mt-20" :attrs="{ required: true }" v-model="form.email" />
                <input-base label="Mot de passe" type="password" :attrs="{ autocomplete: 'new-password', required: true }" v-model="form.password" />
            </div>

            <div v-if="mode == 'logIn'">
                <p class="ft-2xl-bold">Je me connecte</p>
                <button-base type="button" :modifiers="['link']" @click="mode = 'register'">Tu n'as pas de compte ?</button-base>

                <input-base label="Adresse e-mail" type="email" class="mt-20 mb-10" :attrs="{ required: true }" v-model="form.email" />
                <input-base label="Mot de passe" type="password" :attrs="{ required: true }" v-model="form.password" />

                <div class="text-right mt-20">
                    <button-base type="submit">Se connecter</button-base>
                </div>
            </div>
        </form>

        <form class="mt-30" @submit.prevent="onSubmit" v-if="mode != 'logIn'">
            <p class="ft-l-bold">Mes informations</p>

            <div class="d-flex mt-10 mb-10">
                <input-base label="Prénom" type="text" class="mr-10" :attrs="{ required: true }" v-model="form.name" />
                <input-base label="Nom de famille" type="text" :attrs="{ required: true }" v-model="form.surname" />
            </div>
            
            <input-base label="Numéro et rue" :attrs="{ required: true }" type="text" class="mb-10" v-model="form.address" />
            <input-base label="Bâtiment, numéro d'appartement..." type="text" class="mb-10" v-model="form.address2" />

            <div class="d-flex mb-10">
                <input-base label="Code postal" type="text" :attrs="{ required: true }" class="mr-10" v-model="form.postalCode" />
                <input-base label="Ville" type="text" :attrs="{ required: true }" v-model="form.city" />
            </div>

            <div class="SelectBase is-value mb-10">
                <label class="InputBase_label">Pays</label>

                <select
                    v-model="form.country"
                    class="SelectBase_value"
                >
                    <option value="france">
                        France
                    </option>
                </select>
            </div>

            <register-form :no-submit="true" :about-only="true" class="mt-20" @formChange="updateForm" v-if="mode != 'logged'" />

            <label class="d-flex ft-s-medium mt-20" v-if="mode == 'register'">
                <input type="checkbox" v-model="form.newsletter">

                <p class="n-mt-3 ml-5">
                    J'accepte de recevoir la super newsletter de l'Arrière Boutique, <b>garantie sans spam !</b>
                </p>
            </label>

            <div class="text-right mt-20" v-if="mode != 'logIn' || user">
                <button-base type="submit" icon-after="long-arrow-right">Continuer</button-base>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from '@instant-coffee/core'

export default {
    name: 'OrderPage',
    layout: 'order',
    components: { InputBase },
    data: () => ({
        mode: 'register',
        loginErrors: [],
        errors: [],
        form: {
            name: '',
            surname: '',
            email: '',
            address: '',
            address2: '',
            postalCode: '',
            city: '',
            country: 'france',
            newsletter: true
        }
    }),
    computed: {  
        user () { return this.$store.state.auth.user }
    },
    watch: {
        user: {
            immediate: true,
            handler (v) {
                if (v) {
                    this.form = {
                        ...this.form,
                        name: v.name,
                        surname: v.surname,
                        email: v.email,
                        address: v.address,
                        address2: v.address2,
                        postalCode: v.postalCode,
                        city: v.city,
                        country: v.country
                    }
                    
                    this.mode = 'logged'
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
                shopCategory: v.shopCategory,
                shopCategoryCustom: v.shopCategoryCustom,
                shopName: v.shopName
            }
        },
        logOut () {
            this.$auth.logout()
        },
        async onSubmit () {
            const token = await this.$recaptcha.execute('login')

            this.loginErrors = []
            this.errors = []

            try {
                if (this.mode != 'logged') {
                    const response = await this.$auth.loginWith('local', { 
                        data: { ...this.form, token, type: this.mode }
                    })

                    if (response.status != 200) throw response.errors
                }

                if (!this.user) throw ['no-user']

                const response = await this.$store.dispatch('user/update', { 
                    _id: this.user._id,
                    params: { ...this.form, password: undefined, token }
                })

                if (response.status != 1) throw response.errors
        
                await this.$store.dispatch('order/update', {
                    user: this.user._id
                })

                this.$router.push({ path: this.localePath({ name: 'commande-livraison' }) })
            } catch (e) {
                console.error(e)
                this.errors = e
            }
        }
    }
}
</script>

<style>

</style>