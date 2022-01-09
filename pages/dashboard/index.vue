<template>
    <div>
        <div class="Wrapper">
            <div class="bg-pond-xweak br-m">
                <div class="p-40">
                    <p class="ft-2xl-bold">Bonjour {{ user.name }} ! <i class="ml-5 fal fa-sparkles"></i></p>
                </div>
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