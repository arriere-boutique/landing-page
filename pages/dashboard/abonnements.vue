<template>
    <div class="Wrapper Wrapper--left pv-40">
        <subscriptions />
    </div>
</template>

<script>
export default {
    name: 'Abonnements',
    middleware: 'loggedUser',
    layout: 'dashboard',
}
</script>

<style lang="scss" scoped>

</style>