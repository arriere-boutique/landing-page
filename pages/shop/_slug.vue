<template>
    <div class="ProductPage pt-40 pt-0@xs" v-if="product">
        <div class="Wrapper Wrapper--m">
            <button-base tag="nuxt-link" :modifiers="['link']" icon-before="long-arrow-left" :attrs="{ to: localePath({ name: 'shop' }) }">
                Retour aux articles
            </button-base>            
        </div>

        <div class="Wrapper mt-20 pb-100">
            <div class="row">
                <div class="col-5 col-12@xs">
                    <div class="ProductPage_image">
                        <img :src="product.cover">
                    </div>

                    <div class="Block bg-bg-light mt-20 pv-5 ph-15">
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
                    <div class="d-flex">
                        <h1 class="ft-2xl-bold fx-grow mr-15 ft-xl-bold@xs">{{ product.title }}</h1>
                        <p class="ft-3xl-bold color-ft-strong ft-2xl-bold@xs" v-if="product.price">
                            {{ product.price }}<span class="ft-xs-medium">€</span>
                        </p>
                    </div>

                    <text-body class="ProductPage_content mt-20" :modifiers="['simple']" :value="product.content" v-if="product.content" />

                    <div class="d-flex fx-align-center mt-20 d-block@xs text-center@xs">
                        <div class="fx-grow text-right pr-20 text-center@xs pr-0@xs mb-10@xs">
                            <p class="ft-2xl-bold color-ft-strong line-1" v-if="product.price">
                                {{ product.price }}<span class="ft-xs-medium">€</span>
                            </p>
                        </div>  

                        <button-base :modifiers="['accent', 'icon-mango']" :icon-before="product.link.includes('calendly') ? 'calendar-alt' : 'party-horn'" v-bind="booking">
                            {{ product.link.includes('calendly') ? 'Réserver ma session' : 'Commander' }}
                        </button-base>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'ProductPage',
    layout: 'shop',
    async fetch () {
        await this.$store.dispatch('products/get', { query: { slug: this.$route.params.slug }})
    },
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
                        //     "@type": "Article",
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

        this.$store.commit('page/setColor', 'gum');

        return meta
    }
}
</script>