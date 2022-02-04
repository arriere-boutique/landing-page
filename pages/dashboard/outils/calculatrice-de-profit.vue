<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">
            <div class="mv-40">
                <breadcrumbs :items="[
                    { label: 'Outils', to: { name: 'outils' } },
                    { label: 'Calculatrice de profits', active: true },
                ]" />
                
                <p class="ft-3xl-bold mt-5">Calculatrice de profits</p>
            </div>

            <profit-calculator />
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