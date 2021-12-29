<template>
    <div>
        <div class="Wrapper pv-60">
            Logged in {{ user.name }}

            <nuxt-link :to="localePath({ name: 'compte-logout' })">Se déconnecter</nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AccountPage',
    middleware: 'loggedUser',
    layout: 'shop',
    data: () => ({
    }),
    computed: {  
        user () { return this.$store.state.auth.user }
    },
    methods: {
    }
}
</script>

<style>

</style>