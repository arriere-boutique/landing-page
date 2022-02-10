<template>
    <div>
        <p class="ft-xl-medium mb-20">Mes noms de domaine</p>
        
        <div class="row-xs">
            <div class="mv-10 col-6 col-12@s" v-for="shop in shops" :key="shop._id">
                <div class="ShopLine p-20 b " >
                    
                    <div class="fx-center">
                        <div class="ShopLine_logo" :style="{ backgroundImage: `url(${shop.logo})` }"></div>

                        <div class="pl-20 fx-grow">
                            <p class="ft-medium">{{ shop.name }}</p>

                            <div class="mt-10">
                                <p class="ft-s">Ta page est actuellement accessible ici :</p>
                                <link-base class="ft-medium" :href="getLink(shop)" target="_blank">{{ getLink(shop) }}</link-base>
                            </div>
                        </div>
                    </div>

                    <form @submit.prevent="() => onSubmit(shop._id)" class="mt-20 bg-bg-xweak br-s p-20">
                        <p class="ft-m-bold">Modifier mon lien</p>

                        <input-base label="Nom de boutique" class="mt-20" v-model="formData[shop._id].slug" :validator="$validator('slug')" />

                        <select-base label="Domaine" class="mv-10" v-model="formData[shop._id].domain" :options="DOMAINS" />

                        <transition name="fade">
                            <div v-show="formData[shop._id].slug != shop.slug || formData[shop._id].domain != shop.domain">
                                <p class="mt-20 ft-s">Ta page deviendra accessible avec ce lien :</p>
                                <link-base class="ft-medium" :href="getLink(shop, formData[shop._id].slug, formData[shop._id].domain)" target="_blank">{{ getLink(shop, formData[shop._id].slug, formData[shop._id].domain) }}</link-base>

                                <errors :items="errors" class="mt-20" v-if="errors.length > 0" />

                                <div class="text-right mt-20">
                                    <link-base type="button" class="mr-10" @click="formData[shop._id].slug = shop.slug">Annuler</link-base>
                                    <button-base :modifiers="['gum']" :class="{ 'is-disabled': !hasSub }">Modifier</button-base>
                                </div>
                            </div>
                        </transition>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase } from 'instant-coffee-core'
const DOMAINS = [
    { id: 0, label: 'arriere-boutique.local', value: 0 },
    { id: 1, label: 'mapetite.local', value: 1 },
]

export default {
    name: 'ParametresDomains',
    components: { InputBase, SelectBase },
    props: {
        shops: { type: Array, default: () => [] },
        user: { type: Object, default: () => ({}) }
    },
    data: () => ({
        DOMAINS,
        errors: [],
        formData: {}
    }),
    computed: {
        hasSub () { return this.$store.state.user.hasSubscription },
    },
    watch: {
        shops: {
            immediate: true,
            handler (v) {
                if (v && v.length > 0) {
                    this.formData = this.shops.reduce((total, current) => {

                        return { ...total, [current._id]: {
                            slug: current.slug,
                            domain: current.domain
                        }}
                    }, {})
                }
            }
        }
    },
    methods: {
        getLink (shop, slug, domain) {
            return `https://${slug ? slug : shop.slug}.${process.env.domains[domain ? domain : shop.domain]}`
        },
        async onSubmit (id) {
            this.errors = []

            try {
                const response = await this.$store.dispatch('shop/editSlug', {
                    _id: id,
                    slug: this.formData[id].slug,
                    domain: this.formData[id].domain
                })

                if (response.status == 0) this.errors = [ response.message ]
            } catch (e) {
                console.error(e)
            }
        }
    }
}
</script>

<style lang="scss" scoped> 
    .ShopLine {
        border-radius: 10px;
    }

    .ShopLine_logo {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        border-radius: 50%;
        background-size: cover;
    }
</style>