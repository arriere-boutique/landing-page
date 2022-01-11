<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-2xl-bold mv-40">Outils</p>

            <button-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'dashboard-outils-generateur-tags' }) }">
                Trouver des mot-clés
            </button-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardTools',
    middleware: 'loggedUser',
    layout: 'dashboard',
    data: () => ({

    }),
    computed: {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>

</style>