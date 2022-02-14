<template>
    <div>
        <p class="ft-xl-medium mb-20">Mes noms de domaine</p>
        
        <div class="row-xs">
            <div class="mv-10 col-6 col-12@s" v-for="shop in shops" :key="shop._id">
                <div class="ShopLine p-20 b">
                    
                    <div class="fx-center d-block@s">
                        <div class="ShopLine_logo" :style="{ backgroundImage: `url(${shop.logo})` }"></div>

                        <div class="pl-20 fx-grow pl-0@s mt-10@s">
                            <p class="ft-medium">{{ shop.name }}</p>

                            <div class="mt-10">
                                <p class="ft-s">Ta page est actuellement accessible ici :</p>
                                <link-base class="ft-medium" :href="getLink(shop)" target="_blank">{{ getLink(shop) }}</link-base>
                            </div>
                        </div>
                    </div>

                    <hr class="Separator mv-20">

                    <form @submit.prevent="() => onSubmit(shop._id)">
                        <p class="ft-m-medium">
                            Modifier mon lien
                        </p>
                        
                        <input-base label="Nom de boutique" class="mt-20" v-model="formData[shop._id].slug" :validator="$validator('slug')" />

                        <select-base label="Domaine" class="mv-10" v-model="formData[shop._id].domain" :options="domains" />

                        <transition name="fade">
                            <div v-show="formData[shop._id].slug != shop.slug || formData[shop._id].domain != shop.domain">
                                <p class="mt-20 ft-s">Ta page deviendra accessible avec ce lien :</p>
                                <link-base class="ft-medium" :href="getLink(shop, formData[shop._id].slug, formData[shop._id].domain)" target="_blank">{{ getLink(shop, formData[shop._id].slug, formData[shop._id].domain) }}</link-base>

                                <errors :items="errors" class="mt-20" v-if="errors.length > 0" />
                                    
                                <div class="fx-center bg-precious-weak br-s p-10 mt-20 d-block@s" v-if="!user.hasSubscription">
                                    <p class="ft-s-medium color-precious-xstrong mr-10 @mr-0@s">
                                        <i class="fal fa-stars color-precious-xstrong mr-3"></i> Les contributeurs ont accès à cette fonctionnalité.
                                    </p>
                                    
                                    <link-base tag="nuxt-link" class="mt-5@s" :attrs="{ to: localePath({ name: 'abonnements' }) }">
                                        Débloquer
                                    </link-base>
                                </div>

                                <div class="text-right mt-20">
                                    <link-base tag="button" type="button" class="mr-10" @click="onReset">Annuler</link-base>
                                    
                                    <button-base :modifiers="['gum']" :class="{ 'is-disabled': !user.hasSubscription }">Modifier</button-base>
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

export default {
    name: 'ParametresDomains',
    components: { InputBase, SelectBase },
    props: {
        shops: { type: Array, default: () => [] },
        user: { type: Object, default: () => ({}) }
    },
    data: () => ({
        domains: process.env.domains.map((d, i) => ({ id: i, value: i, label: d })),
        errors: [],
        formData: {}
    }),
    computed: {
        user () { return this.$store.state.user },
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
        onReset () {
            this.formData = this.shops.reduce((total, current) => ({
                ...total,
                [current._id]: {
                    slug: current.slug,
                    domain: current.domain
                }
            }), {})
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