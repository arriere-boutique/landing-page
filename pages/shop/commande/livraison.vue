<template>
    <div class="pl-40">
        <form @submit.prevent="onSubmit">
            <p class="ft-2xl-bold">Livraison</p>

            <div id="card-element"></div>

            <div class="text-right mt-20">
                <button-base type="submit" icon-after="long-arrow-right">Continuer</button-base>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'DeliveryPage',
    layout: 'order',
    components: { InputBase },
    data: () => ({
        errors: [],
        form: {},
        elements: null
    }),
    computed: {  
        user () { return this.$store.state.auth.user }
    },
    watch: {
    },
    methods: {
        async onSubmit () {
            try {
                const response = await this.$stripe.confirmPayment({
                    elements: this.elements,
                    confirmParams: {
                        return_url: process.env.baseUrl + this.localePath({ name: 'commande-confirmation' })
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
    },
    async mounted () {
        if (!this.$store.state.order.order) this.$router.push({ path: this.localePath({ name: 'commande' }) })

        try {
            let response = await this.$store.dispatch('order/checkout')
    
            if (this.$stripe) {
                this.elements = this.$stripe.elements({ clientSecret: response.token })
                const card = this.elements.create('payment')
                card.mount('#card-element')
            }
        } catch (e) {
            console.error(e)
        }
    }
}
</script>

<style>

</style>