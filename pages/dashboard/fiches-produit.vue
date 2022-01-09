<template>
    <div>
        <div class="Wrapper">
            <div class="bg-sunset-xweak br-m mb-40">
                <div class="p-40">
                    <p class="ft-2xl-bold">Mes fiches produit</p>
                </div>
            </div>
            <div v-for="shop in shops" :key="shop._id">
                <div class="d-flex mv-15" v-for="listing in shop.listings" :key="listing._id">
                    <img :src="listing.images[0].thumbnail" width="100" height="100">
                    
                    <p>{{ listing.title }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardListings',
    middleware: 'loggedUser',
    layout: 'dashboard',
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items }
    },
    methods: {}
}
</script>

<style>

</style>