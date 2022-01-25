<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">
            <p class="ft-2xl-bold mv-40">Mes pages</p>

            <div class="Page_cols">
                <div class="fx-grow">
                    <transition-group name="default" class="row-s">
                        <div class="col-6 col-12@m mb-20" v-for="landing in landings.filter(l => l.isActive)" :key="landing._id">
                            <landing-block v-bind="landing" />
                        </div>
                    </transition-group>

                    <template v-if="landings.filter(l => !l.isActive).length > 0">
                        <p class="ft-xl-bold mt-40 mb-20">Pages désactivées</p>

                        <transition-group name="default" class="row-s">
                            <div class="col-6 col-12@m mb-20" v-for="landing in landings.filter(l => !l.isActive)" :key="landing._id">
                                <landing-block v-bind="landing" />
                            </div>
                        </transition-group>
                    </template>
                </div>

                <div class="Page_side p-20 text-center">
                    <button-base
                        icon-before="plus"
                        :modifiers="['ice']"
                        tag="nuxt-link"
                        :class="{ 'is-disabled': true }"
                        :attrs="{
                            to: localePath({ name: 'pages-id', params: { id: 'new' }})
                        }"
                    >
                        Créer une page
                    </button-base>

                    <div class="bg-ice-xweak p-20 line-2 color-ice-strong br-s ft-s-medium mt-20">Bientôt, tu pourras créer plusieurs pages selon tes besoins !</div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'DashboardPages',
    middleware: 'loggedUserAndShop',
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