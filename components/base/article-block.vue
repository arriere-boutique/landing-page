<template>
    <nuxt-link tag="article" class="ArticleBlock" :class="[ $modifiers, `ArticleBlock--${$theme(category).color}` ]" :to="localePath({ name: 'category-slug', params: { category: $theme(category).slug, slug } })">
        <div class="ArticleBlock_image" :style="{ backgroundImage: `url(${image})` }"></div>

        <div class="ArticleBlock_content">
            <h4 class="ArticleBlock_category">
                {{ $t(`blog.categories.${category}.label`) }}
                <!-- <span class="ArticleBlock_date"><i class="fa-thin fa-clock mr-3"></i> {{ date }}</span> -->
            </h4>

            <h4 class="ArticleBlock_title ellipsis-3">{{ title|specials }}</h4>
        </div>
    </nuxt-link>
</template>

<script>
import { ModifiersMixin } from '@instant-coffee/core'
import moment from 'moment'

export default {
    name: 'ArticleBlock',
    mixins: [ ModifiersMixin ],
    props: {
        title: { type: String },
        modifiers: { type: Array, default: () => [] },
        excerpt: { type: String },
        image: { type: String },
        category: { type: String },
        content: { type: String },
        slug: { type: String },
        createdAt: { type: Object },
        updatedAt: { type: Object }
    },
    computed: {
        date () {
            return this.$props.updatedAt.fromNow()
        }
    }
}
</script>