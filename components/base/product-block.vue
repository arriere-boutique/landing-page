<template>
    <div
        class="ProductBlock"
        :class="[ $modifiers ]"
    >
        <nuxt-link class="ProductBlock_container" :to="path ? path : localePath({ name: 'shop-category-slug', params: { category, slug } })">
            <div class="ProductBlock_image" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="ProductBlock_attributes">
                <div class="ProductBlock_subtitle" :class="[`bg-${attribute.color}`]" v-for="attribute in attributes" :key="attribute.text">
                    <i class="fal mr-3" :class="[`fa-${attribute.icon}`]"></i> {{ attribute.text }}
                </div>
            </div>

            <div class="ProductBlock_content">
                <h3 class="ProductBlock_title ellipsis-2 mb-3">{{ title|specials }}</h3>

                {{ price }}<span>€</span>
            </div>
        </nuxt-link>
            
        <div class="ProductBlock_footer" v-if="!path">
            <button-base icon-before="plus" :modifiers="['link', 'light']" tag="nuxt-link" :attrs="{ to: localePath({ name: 'shop-category-slug', params: { category, slug } }) }">
                Plus d'infos
            </button-base>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
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
        path: { type: [Object, String] }
    },
    computed: {
        date () {
            return this.$props.updatedAt.fromNow()
        },
        htmlSubtitle () {
            return process.server ? this.$props.subtitle : this.$props.subtitle.replaceAll('+', '<br>+')
        },
        attributes () {
            return [
                { icon: 'pen-clip', text: `Les Travaux Pratiques`, color: 'pond' },
                { icon: 'fire', text: `20% de réduc'`, color: 'precious' }
            ]
        }
    },
}
</script>