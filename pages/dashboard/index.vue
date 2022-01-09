<template>
    <div>
        <div class="bg-pond-xweak">
            <div class="p-40">
                <p class="ft-hand-xs">Bonjour {{ user.name }} ! <i class="ml-5 fal fa-sparkles"></i></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: 'loggedUser',
    layout: 'dashboard',
    computed: {
        user () { return this.$store.state.auth.user },
    }
}
</script>

<style>

</style>