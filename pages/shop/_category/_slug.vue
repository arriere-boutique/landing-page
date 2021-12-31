<template>
    <div class="ProductPage pt-40 pt-0@xs" v-if="product">
        <div class="bg-bg-light">
            <div class="Wrapper Wrapper--m">
                <breadcrumbs :items="breadcrumbs" />
            </div>

            <div class="Wrapper mt-40 pb-100">
                <div class="row">
                    <div class="col-5 col-12@xs">
                        <div class="ProductPage_image">
                            <img :src="product.cover">
                        </div>

                        <div class="Block bg-accent-xweak mt-20 pv-5 ph-15">
                            <div class="mv-10 d-flex fx-align-center" v-if="product.link.includes('calendly')">
                                <i class="color-accent fal fa-calendar-alt fa-xl mr-15"></i>
                                <button-base :modifiers="['link', 'strong']" v-bind="booking" class="ft-m-medium">Voir mes disponibilités en direct</button-base>
                            </div>

                            <div class="mv-10 d-flex fx-align-center" v-else-if="delivery">
                                <i class="color-accent fal fa-circle-bolt fa-xl mr-15"></i>
                                <p class="ft-m-medium" v-html="delivery"></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-7 col-12@xs mt-20@xs">
                        <h1 class="n-mt-10 ft-3xl-bold color-ft-strong fx-grow mr-15 ft-xl-bold@xs">{{ product.title }}</h1>
                        <p class="mt-5 ft-xl-medium color-ft-strong" v-if="product.price">
                            {{ currentVariation.price }}<span class="ft-xs-medium">€</span>
                        </p>

                        <hr class="Separator">

                        <text-body class="ProductPage_content mv-20" :modifiers="['simple']" :value="product.content" v-if="product.content" />

                        <hr class="Separator">

                        <div class="ProductPage_variations mv-20">
                            <div class="ft-m-medium mb-10"><i class="fal fa-sparkles"></i> Ce sera tout ?</div>
                            <div
                                class="ProductPage_variation"
                                v-for="variation in product.variations"
                                :class="{ 'is-active': variation._id == currentVariation._id}"
                                :key="variation._id"
                                @click="currentVariation = variation"
                            >
                                {{ variation.title }} 

                                <span>
                                    {{ (variation.price > currentVariation.price ? "+" : "") + Math.round(variation.price - currentVariation.price) + '€' }}
                                </span>
                            </div>
                        </div>

                        <div class="d-flex fx-align-center fx-justify-end text-right">
                            <div class="ft-xl-medium d-inline-block mr-10">
                                {{ currentVariation.price }}<span class="ft-s-medium">€</span>
                            </div>

                            <input-base class="width-3xs mh-10" :helpers="['number']" min="1" type="number" v-model="quantity" />

                            <button-base :modifiers="['accent']" :icon-before="'shopping-cart'" @click="addToCart">
                                Ajouter au panier
                            </button-base>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase } from '@instant-coffee/core'
import moment from 'moment'

export default {
    name: 'ProductPage',
    layout: 'shop',
    components: { InputBase, SelectBase },
    async fetch () {
        await this.$store.dispatch('products/get', { query: { slug: this.$route.params.slug }})
        this.currentVariation = this.product.variations[0]
    },
    data: () => ({
        quantity: 1,
        currentVariation: {}
    }),
    computed: {
        product () {
            return this.$store.getters['products/findOne']({ slug: this.$route.params.slug })
        },
        delivery () {
            let delivery = null

            if (this.product.deliveryMin || this.product.deliveryMax) {
                if (this.product.deliveryMin == 0 && this.product.deliveryMax > 0) {
                    delivery = `Réception avant le <b>${moment().add(this.product.deliveryMax, 'days').format('dddd D MMMM')}</b>.`
                }

                if (this.product.deliveryMin > 0 && this.product.deliveryMax > 0) {
                    delivery = `Réception entre le <b>${moment().add(this.product.deliveryMin, 'days').format('dddd D MMMM')}</b> et le ${moment().add(this.product.deliveryMax, 'days').format('dddd D MMMM')}.`
                }
            }

            return delivery
        },
        booking () {
            if (!this.product.link) return null

            if (this.product.link.includes('calendly')) {
                return {
                    attrs: {
                        onclick: `Calendly.initPopupWidget({ url: '${this.product.link}?hide_gdpr_banner=1&hide_event_type_details=1&primary_color=4DA2A8'});return false;`
                    }
                }
            } else {
                return {
                    tag: 'a',
                    target: '_blank',
                    link: this.product.link
                }
            }
        },
        breadcrumbs () {
            return [
                { label: 'La boutique', to: { name: 'shop' } },
                { label: this.product.category, to: { name: 'shop-category', params: { category: this.product.category }} },
                { label: this.product.title, active: true}
            ]
        }
    },
    watch: {
        quantity (v) {
            if (v < 1) this.quantity = 1
        }
    },
    methods: {
        async addToCart () {
            await this.$store.dispatch('order/addItem', {
                _id: this.currentVariation._id,
                quantity: this.quantity
            })
        }
    },
    head () {
        let meta = {
            title: this.product.title + this.$t('meta.append'),
            meta: [
                { hid: 'description', name: 'description', content: this.product.content.replace(/(<([^>]+)>)/gi, "") }
            ],
            script: [
                {
                    type: 'application/ld+json', json: {
                        // structuredData: {
                        //     "@context": "http://schema.org",
                        //     "@type": "Article",is-light
                        //     articleSection: this.$t(`blog.categories.${this.article.category}.label`),
                        //     articleBody: this.article.content.replace(/(<([^>]+)>)/gi, ""),
                        //     name: this.article.title,
                        //     headline: this.article.title,
                        //     image: this.article.cover,
                        //     thumbnailUrl: this.article.thumbnail,
                        //     dateCreated: this.article.createdAt.toISOString(),
                        //     dateUpdated: this.article.updatedAt.toISOString(),
                        //     author: this.$authorData()
                        // }
                    }
                }
            ]
        }

        this.$store.commit('page/setColor', 'light')

        return meta
    }
}
</script>