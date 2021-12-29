<template>
    <component
        :is="!link ? 'nuxt-link' : 'a'"
        tag="article"
        :href="link"
        :target="link ? '_blank' : undefined"
        class="ArticleBlock"
        :class="[ $modifiers, `ArticleBlock--${$theme(category).color}` ]"
        :to="path ? path : localePath({ name: 'category-slug', params: { category: $theme(category).slug, slug } })"
    >
        <div class="ArticleBlock_image" :style="{ backgroundImage: `url(${image})` }"></div>

        <div class="ArticleBlock_content">
            <h4 class="ArticleBlock_category ellipsis-1">
                {{ $t(`blog.categories.${category}.label`) }}
               <!-- <span class="ArticleBlock_date"><i class="fa-thin fa-clock mr-3"></i> {{ date }}</span> -->
            </h4>

            <h3 class="ArticleBlock_title ellipsis-3">{{ title|specials }}</h3>

            <p class="ArticleBlock_excerpt">{{ excerpt|striptags }}</p>
        </div>
    </component>
</template>

<script>
import { ModifiersMixin } from '@instant-coffee/core'

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
        updatedAt: { type: Object },
        path: { type: [Object, String] },
        link: { type: String }
    },
    computed: {
        date () {
            return this.$props.updatedAt.fromNow()
        }
    }
}
</script>