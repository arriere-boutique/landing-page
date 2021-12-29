<template>
    <div class="">
        <component :is="noSubmit ? 'div' : 'form'" @submit.prevent="onSubmit">
            <input-base label="Ton adresse e-mail" class="mb-10" :attrs="{ required: true, autocomplete: 'email', }" v-model="formData.email" type="email" />

            <input-base
                label="Ton prénom"
                v-model="formData.name"
                class="mb-10"
                type="text"
                :attrs="{ required: true, }"
            />

            <div class="pv-10 ph-20 b br-8 mb-10" v-show="state.isActive">
                <p class="mb-15 mt-5 ft-m-bold">À propos de ta boutique </p>

                <input-base
                    label="Nom de ta boutique"
                    v-model="formData.shopName"
                    type="text"
                    :attrs="{ required: true }"
                    class="mv-10"
                />

                <div class="SelectBase is-value mb-10">
                    <label class="InputBase_label"> Ton domaine</label>

                    <select
                        v-model="formData.shopCategory"
                        class="SelectBase_value"
                    >
                        <option v-for="option in CATEGORIES" :key="option.id" :value="option.id">
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <input-base
                    label="Quel type de produits vends-tu ?"
                    v-model="formData.shopCategoryCustom"
                    type="text"
                    class="mb-10"
                    v-show="formData.shopCategory == 7"
                />

                <div class="d-flex fx-align-center">
                    <div class="ft-m-medium fx-grow mr-10">
                        <p v-for="error in state.errors" :key="error">
                            {{ $t(`EmailingForm.errors.${error}`) }}
                        </p>

                        <p v-if="state.isSuccess">
                            <i class="fal fa-face-party mr-5"></i> Abonnement confirmé, on se retrouve bientôt dans ta boîte mail !
                        </p>
                    </div> 
                </div>
            </div>

            <input-base
                label="Mot de passe"
                type="password"
                :attrs="{ autocomplete: 'new-password' }"
                v-model="formData.password"
            />

            <label class="d-flex ft-s-medium mt-10" v-show="state.isActive">
                <input type="checkbox" v-model="formData.newsletter">

                <p class="n-mt-3 ml-5">
                    J'accepte de recevoir la super newsletter de l'Arrière Boutique, <b>garantie sans spam !</b>
                </p>
            </label>

            <button-base type="submit" :icon-before="state.loading ? '' : 'party-horn'" :class="{ 'is-disabled': state.isSuccess || state.loading }" v-if="!noSubmit">
                {{ state.loading ? 'Une petite seconde...' : (state.isSuccess ? `C'est tout bon !` : `Je m'abonne`) }}
            </button-base>
        </component>
    </div>
</template>

<script>
const CATEGORIES = [
    { id: 0, label: 'Bijoux (colliers, anneaux...)' },
    { id: 1, label: 'Vêtements & accessoires (chaussures, sacs...)' },
    { id: 2, label: 'Art (gravure, peinture...)' },
    { id: 3, label: 'Papeterie (carnets, cartes...)' },
    { id: 4, label: 'Décoration & maison (vases, bougies...)' },
    { id: 8, label: 'Cosmétique (savon, crèmes...)' },
    { id: 5, label: 'Pour enfants (jouets, loisirs...)' },
    { id: 6, label: '100% digital (à imprimer chez soi, print-on-demand...)' },
    { id: 7, label: 'Je vends autre chose' },
]

import { InputBase, SelectBase } from '@instant-coffee/core'

export default {
    name: 'RegisterForm',
    components: { InputBase, SelectBase },
    props: {
        type: { type: String },
        noSubmit: { type: Boolean, default: false },
    },
    data: () => ({
        CATEGORIES,
        state: {
            isActive: false,
            isSuccess: false,
            isLoading: false,
            errors: []
        },
        formData: {
            email: '',
            name: '',
            shopName: '',
            shopCategory: 0,
            shopCategoryCustom: '',
            password: '',
            newsletter: true
        }
    }),
    watch: {
        ['formData.email'] (v) {
            this.state.isActive = true
        },
        formData: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$emit('formChange', this.formData)
            }
        }
    },
    methods: {
        async onSubmit () {
            if (this.noSubmit) return

            this.state.isLoading = true
            this.state.isSuccess = false
            this.state.errors = []

            const token = await this.$recaptcha.execute('login')

            try {
                let response = await this.$store.dispatch('subscribe/create', {
                    ...this.formData,
                    shopCategory: this.formData.shopCategory + 1,
                    token
                })

                this.state.isSuccess = true
                this.state.isLoading = false
            } catch (e) {
                this.state.errors = e
                this.state.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .EmailingForm {
        display: flex;
    }

    .EmailingForm_image {
        margin-right: 40px;
    }

    .EmailingForm--simple {
        display: block;
    }

    .EmailingForm--s {

        .EmailingForm_image {
            margin-right: 20px;
        }

        .EmailingForm_title {
            font: var(--ft-l-bold);
        }
    }
</style>