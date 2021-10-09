<template>
    <div
        class="ProductBlock"
        :class="[ $modifiers ]"
    >
        <nuxt-link class="ProductBlock_container" :to="path ? path : localePath({ name: 'shop-slug', params: { slug } })">
            <div class="ProductBlock_image" :style="{ backgroundImage: `url(${thumbnail})` }">

                <div class="ProductBlock_price" v-if="price">
                    {{ price }}<span>€</span>

                    <icon-base class="ProductBlock_priceBlob" name="blob/blob-1" />
                </div>

                <div class="ProductBlock_subtitle" v-if="subtitle" v-html="htmlSubtitle"></div>
            </div>

            <div class="ProductBlock_content">
                <h3 class="ProductBlock_title ellipsis-2">{{ title|specials }}</h3>
            </div>
        </nuxt-link>
            
        <div class="ProductBlock_footer" v-if="!path">
            <div class="ProductBlock_footerAction">
                <button-base icon-before="plus" :modifiers="['link']" tag="nuxt-link" :attrs="{ to: localePath({ name: 'shop-slug', params: { slug } }) }">
                    Plus d'infos
                </button-base>
            </div>

            <div class="ProductBlock_footerAction" v-if="booking">
                <button-base
                    v-bind="booking"
                    :icon-before="link.includes('calendly') ? 'calendar-alt' : 'party-horn'"
                    :modifiers="['accent', 'link']"
                >
                    {{ link.includes('calendly') ? 'Réserver' : 'Commander' }}
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from '@instant-coffee/core'
import iconBase from './icon-base.vue'

export default {
    components: { iconBase },
    name: 'ProductBlock',
    mixins: [ ModifiersMixin ],
    props: {
        title: { type: String },
        subtitle: { type: String, default: '' },
        price: { type: Number },
        modifiers: { type: Array, default: () => [] },
        thumbnail: { type: String },
        category: { type: String },
        content: { type: String },
        slug: { type: String },
        createdAt: { type: Object },
        updatedAt: { type: Object },
        path: { type: Object },
        link: { type: String }
    },
    computed: {
        date () {
            return this.$props.updatedAt.fromNow()
        },
        htmlSubtitle () {
            return process.server ? this.$props.subtitle : this.$props.subtitle.replaceAll('+', '<br>+')
        },
        booking () {
            if (!this.$props.link) return null

            if (this.$props.link.includes('calendly')) {
                return {
                    attrs: {
                        onclick: `Calendly.initPopupWidget({ url: '${this.$props.link}?hide_gdpr_banner=1&primary_color=4DA2A8'});return false;`
                    }
                }
            } else {
                return {
                    tag: 'a',
                    target: '_blank',
                    link: this.$props.link
                }
            }
        }
    },
}
</script>