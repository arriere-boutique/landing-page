<template>
    <div class="pl-40">
        <form class="mt-30" @submit.prevent="onSubmit">
            <p class="ft-2xl-bold">Mes informations</p>

            <div class="d-flex mt-20 mb-10">
                <input-base label="Prénom" type="text" :attrs="{ required: true }" v-model="form.name" />
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

            <div class="text-right mt-20">
                <button-base type="submit" icon-after="long-arrow-right">Continuer</button-base>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'InformationsPage',
    layout: 'order',
    components: { InputBase },
    data: () => ({
        errors: [],
        form: {
            name: '',
            surname: '',
            address: '',
            address2: '',
            postalCode: '',
            city: '',
            country: 'france'
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
                }
            }
        } 
    },
    methods: {
        async onSubmit () {
            const token = await this.$recaptcha.execute('login')

            this.errors = []

            try {
                const response = await this.$store.dispatch('user/update', { 
                    _id: this.user._id,
                    params: { ...this.form, password: undefined, token }
                })

                if (response.status != 1) throw response.errors

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