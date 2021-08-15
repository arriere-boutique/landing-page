<template>
    <article class="ArticleBlock" :class="{ ...$modifiers }">
        <div class="ArticleBlock_image" :style="{ backgroundImage: `url(${image})` }"></div>

        <div class="ArticleBlock_content">
            <h4 class="ArticleBlock_category">{{ category }}</h4>
            <h4 class="ArticleBlock_title">{{ title }}</h4>
            
            <p class="ArticleBlock_excerpt">{{ excerpt }}</p>

            <div class="ArticleBlock_footer">
                <div class="ArticleBlock_date">Publié il y 5 jours</div>

                <button-base icon-after="long-arrow-right">
                    Lire la suite
                </button-base>
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
        category: { type: String }
    }
}
</script>