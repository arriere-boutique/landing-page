<template>
    <div class="BlogPage bg-bg-light">
        <div class="bg-pond-xweak pv-60">
            <div class="Wrapper">

            </div>
        </div>

        <div class="Wrapper pv-60">
            <breadcrumbs :items="breadcrumbs" />
            
            <div class="row-xs mt-30">
                <div class="col-3 mv-5 col-6@s col-12@xs" v-for="product in products" :key="product._id">
                    <product-block
                        v-bind="product"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShopCategory',
    layout: 'shop',
    async fetch () {
        await this.$store.dispatch('products/fetch', {
            query: { status: 'published' }
        })
    },
    data: () => ({
    }),
    computed: {
        products () {
            return this.$store.getters['products/find']({ status: 'published', category: this.$route.params.category })
        },
        breadcrumbs () {
            return [
                { label: 'La boutique', to: { name: 'shop' } },
                { label: this.$route.params.category, active: true }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>

</style>