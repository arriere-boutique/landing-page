<template>
    <nuxt-link tag="article" class="ArticleBlock" :class="[ $modifiers, `ArticleBlock--${$theme(category).color}` ]" :to="localePath({ name: 'category-slug', params: { category: $theme(category).slug, slug } })">
        <div class="ArticleBlock_image" :style="{ backgroundImage: `url(${image})` }"></div>

        <div class="ArticleBlock_content">
            <div class="fx-grow">
                <h4 class="ArticleBlock_category">
                    <i class="fa-thin mr-3" :class="[ $theme(category).fa ]"></i> {{ $t(`blog.categories.${category}.label`) }}
                </h4>
                <h4 class="ArticleBlock_title ellipsis-2">{{ title|specials }}</h4>
                
                <p class="ArticleBlock_excerpt">{{ excerpt|striptags|specials }}</p>
            </div>
        </div>
    </nuxt-link>
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
        slug: { type: String }
    }
}
</script>