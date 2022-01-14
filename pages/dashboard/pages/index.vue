<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-2xl-bold mv-40">Mes pages</p>

            <div class="Page_cols">
                <div class="fx-grow">
                    <div class="row-s">
                        <div class="col-6" v-for="landing in landings" :key="landing._id">
                            <landing-block v-bind="landing" />
                        </div>
                    </div>
                </div>

                <div class="Page_side p-20 text-center">
                    <button-base
                        icon-before="plus"
                        :modifiers="['ice']"
                        tag="nuxt-link"
                        :attrs="{
                            to: localePath({ name: 'pages-slug', params: { slug: 'new' }})
                        }"
                    >
                        Créer une page
                    </button-base>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'DashboardPages',
    middleware: 'loggedUser',
    layout: 'dashboard',
    async fetch () {
        await this.$store.dispatch('landings/fetch', { owner: '$self' })
    },
    computed: {
        landings () { return this.$store.getters['landings/items'] }
    },
    methods: {
        createPage () {
            
        }
    }
}
</script>

<style>

</style>