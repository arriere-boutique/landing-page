<template>
    <div></div>
</template>

<script>
export default {
    name: 'LogoutPage',
    middleware: 'loggedUser',
    async mounted () {
        await this.$store.dispatch('user/logOut')
        this.$router.push('/')
    }
}
</script>