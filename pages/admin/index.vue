<template>
    <div class="LayoutLogin">
        <form class="LayoutLogin_form" @submit.prevent="onSubmit">
            <input-base
                v-for="(row, key) in form"
                class="mv-10"
                v-bind="row"
                v-model="row.value"
                :key="key"
            />

            <div class="text-center mt-20">
                <div v-for="(error, i) in errors" :key="i">
                    {{ error }}
                </div>

                <button-base :modifiers="['cherry', 's']" tag="button" type="submit" class="m-auto">
                    Se connecter
                </button-base>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from '@instant-coffee/core'

export default {
    name: 'LoginPage',
    layout: 'login',
    components: { InputBase },
    data: () => ({
        errors: [],
        form: {
            email: { label: 'Adresse e-mail', type: 'email', attrs: { required: true }, value: '' },
            password: { label: 'Mot de passe', type: 'password', attrs: { required: true }, value: '' }
        }
    }),
    methods: {
        async onSubmit () {
            this.$data.errors = []
            
            let params = Object.keys(this.$data.form).reduce((prev, key) => ({
                ...prev,
                [key]: this.$data.form[key].value,
                registerToken: this.$route.query.token ? this.$route.query.token : undefined
            }), {})

            const response = await this.$auth.loginWith('local', { 
                data: { ...params }
            })

            if (response.data.status != 1) {
                this.$data.errors = response.data.errors
            } else {
                this.$router.push({ path: this.localePath('/dashboard') });
            }
        }
    }
}
</script>