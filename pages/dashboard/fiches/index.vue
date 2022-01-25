<template>
    <div>
        <div class="Wrapper Wrapper--left pb-100">
            <p class="ft-2xl-bold mv-40">Mes fiches produit</p>

            <div class="Page_cols">
                <div>
                    <div class="d-flex fx-align-center">
                        <div class="ft-s-bold mr-10">Trier par</div>

                        <button-base type="button" class="m-3" :modifiers="['secondary', 'xs']" :icon-before="sort == 'profit' ? 'check' : ''" @click="sort = 'profit'">
                            Profit estimé
                        </button-base>

                        <button-base type="button" class="m-3" :modifiers="['secondary', 'xs']" :icon-before="sort == 'favorites' ? 'check' : ''" @click="sort = 'favorites'">
                            Nombre de favoris
                        </button-base>
                    </div>

                    <hr class="Separator mt-30 mb-40">

                    <transition-group name="default" class="row-s p-relative">
                        <div class="col-4 mb-20" v-for="listing in displayedListings" :key="listing._id" @click="openListing(listing._id)">
                            <listing-block v-bind="listing" />
                        </div>
                    </transition-group>

                    <div class="text-center mt-20" v-if="displayedListings.length < listings.length">
                        <button-base type="button" :modifiers="['secondary', 's']" icon-before="plus" @click="offset += 6">
                            Afficher la suite
                        </button-base>
                    </div>
                </div>

                <!-- <div class="Page_side">
                    Hello
                </div> -->
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
    middleware: 'loggedUserAndShop',
    layout: 'dashboard',
    async fetch () {
        this.shops.forEach(shop => {
            this.$store.dispatch('shop/sync', {
                notification: false,
                params: { id: shop._id, syncItems: [ 'listings' ] }
            })
        })
    },
    data: () => ({
        activeListing: null,
        offset: 0,
        sort: ''
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        shops () { return this.$store.state.shop.items },
        listings () {
            let listings = this.$store.getters['shop/allListings']

            if (this.sort == 'favorites') listings = listings.sort((a, b) => b.favorites - a.favorites)
            if (this.sort == 'profit') listings = listings.sort((a, b) => {
                return (b.costs ? b.costs.totalRemaining : 0) - (a.costs ? a.costs.totalRemaining : 0)
            })
            if (this.sort == '') listings = listings
            
            return listings
        },
        displayedListings () { return this.listings.slice(0, 9 + this.offset) }
    },
    watch: {
        sort () {
            this.offset = 0
        }
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