<template>
    <div v-if="order">
        {{ order.id }}
    </div>
</template>

<script>
export default {
    name: 'OrderPage',
    async fetch () {
        this.order = await this.$store.dispatch('orders/get', { query: { id: this.$route.params.id }})
    },
    data: () => ({
        order: null
    })
}
</script>