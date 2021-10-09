+<template>
    <div>
        <div class="Page_content Wrapper Wrapper--m">
            <div class="fx-grow pb-100">
                <div class="row-s" v-if="products.length > 0">
                    <div class="col-4 mb-40" v-for="product in products" :key="product._id">
                        <product-block
                            v-bind="product"
                            :path="localePath({ name: 'admin-catalogue-id', params: { id: product._id } })"
                        />
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'admin-catalogue-id', params: { id: 'new' } })
                    }"
                >
                    Créer un produit 
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CataloguePage',
    layout: 'admin',
    async fetch () {
        await this.$store.dispatch('products/fetch', { query: {} })
    },
    computed: {
        products () { return this.$store.getters['products/find']() },
    },
    head () {
        let meta = {
            title: 'Catalogue'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>