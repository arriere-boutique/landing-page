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

                    <form @submit.prevent="onSubmit" class="mt-20 bg-bg-xweak br-s p-20">
                        <p class="ft-m-bold">Modifier mon nom de domaine</p>

                        <input-base label="Nouveau nom de domaine" class="mt-20" v-model="formData[shop._id].slug" />

                        <transition name="fade">
                            <div v-show="formData[shop._id].slug != shop.slug">
                                <p class="mt-20 ft-s">Ta page deviendra accessible avec ce lien :</p>
                                <link-base class="ft-medium" :href="getLink(shop, formData[shop._id].slug)" target="_blank">{{ getLink(shop, formData[shop._id].slug) }}</link-base>

                                <div class="text-right mt-20">
                                    <link-base type="button" class="mr-10" @click="formData[shop._id].slug = shop.slug">Annuler</link-base>
                                    <button-base :modifiers="['gum']">Modifier</button-base>
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
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'ParametresDomains',
    components: { InputBase },
    props: {
        shops: { type: Array, default: () => [] },
        user: { type: Object, default: () => ({}) }
    },
    data: () => ({
        formData: {}
    }),
    computed: {

    },
    watch: {
        shops: {
            immediate: true,
            handler (v) {
                if (v && v.length > 0) {
                    this.formData = this.shops.reduce((total, current) => {

                        return { ...total, [current._id]: {
                            slug: current.slug
                        }}
                    }, {})

                    console.log(this.formData)
                }
            }
        }
    },
    methods: {
        getLink (shop, slug) {
            return `https://${slug ? slug : shop.slug}.${process.env.baseDomain}`
        },
        onSubmit () {

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