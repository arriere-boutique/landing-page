<template>
    <div class="Wrapper Wrapper--left pt-40 pb-100" v-if="!isLoading">
        <div v-if="success">
            <h1 class="ft-2xl-bold mb-20">Merci beaucoup pour ton soutien.</h1>
        </div>
        <div v-else>
            <h1 class="ft-2xl-bold mb-20">Une erreur est survenue</h1>
            <p>Une erreur est survenue. Merci de me contacter par email : theotime@arriere-boutique.fr</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfirmationPage',
    layout: 'dashboard',
    async fetch () {
        try {
            const response = await this.$store.dispatch('order/confirm', {
                id: this.$route.query.payment_intent,
                secret: this.$route.query.payment_intent_client_secret,
            })

            this.$router.push({ query: {} })

            this.success = response.success
        } catch (e) {
            console.error(e)
        }

        this.isLoading = false
    },
    data: () => ({
        isLoading: true,
        success: false
    })
}
</script>

<style>

</style>