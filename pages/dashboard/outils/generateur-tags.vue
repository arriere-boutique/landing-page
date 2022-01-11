<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <div class="mv-40">
                <breadcrumbs :items="[
                    { label: 'Outils', to: { name: 'dashboard-outils' } },
                    { label: 'Générateur de tags', active: true },
                ]" />
                
                <p class="ft-3xl-bold mt-5">Générateur de tags</p>
            </div>

            <tag-generator />
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'DashboardTools',
    middleware: 'loggedUser',
    layout: 'dashboard',
    components: { InputBase },
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