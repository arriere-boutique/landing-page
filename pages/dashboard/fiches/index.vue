<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-2xl-bold mv-40">Mes fiches produit</p>

            <div class="row-s">
                <div class="col-4 mb-20" v-for="listing in listings" :key="listing._id" @click="openListing(listing._id)">
                    <listing-block v-bind="listing" />
                </div>
            </div>
        </div>

        <popin-base :is-active="activeListing ? true : false" :modifiers="['panel']" :auto-close="false" @close="onClose">
            <template slot="content">
                <listing-body class="p-40" :id="activeListing" />
            </template>
        </popin-base>
    </div>
</template>

<script>
export default {
    name: 'DashboardListings',
    middleware: 'loggedUser',
    layout: 'dashboard',
    data: () => ({
        activeListing: null
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        listings () { return this.$store.getters['shop/allListings'] }
    },
    methods: {
        onClose () {
            this.activeListing = null
        },
        openListing (id) {
            this.activeListing = id
        }
    }
}
</script>

<style>

</style>