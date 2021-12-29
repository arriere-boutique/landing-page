<template>
    <div></div>
</template>

<script>
export default {
    name: 'LogoutPage',
    middleware: 'loggedUser',
    mounted () {
        this.$auth.logout()
    }
}
</script>