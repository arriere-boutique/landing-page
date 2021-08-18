<template>
    <article class="ArticleBlock" :class="{ ...$modifiers }">
        <div class="ArticleBlock_image" :style="{ backgroundImage: `url(${image})` }"></div>

        <div class="ArticleBlock_content">
            <div class="fx-grow">
                <h4 class="ArticleBlock_category">{{ $t(`blog.categories.${category}.label`) }}</h4>
                <h4 class="ArticleBlock_title ellipsis-2">{{ title|specials }}</h4>
                
                <p class="ArticleBlock_excerpt ellipsis-2">{{ excerpt|specials }}</p>

                <div class="ArticleBlock_footer">
                    <div class="ArticleBlock_date">Publié il y 5 jours</div>

                    <button-base
                        tag="nuxt-link"
                        icon-after="long-arrow-alt-right"
                        :attrs="{
                            to: localePath({ name: 'blog-slug', params: { slug } })
                        }"
                        v-if="slug"
                    >
                        Lire la suite
                    </button-base>
                </div>
            </div>
        </div>
    </article>
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
        slug: { type: String }
    }
}
</script>