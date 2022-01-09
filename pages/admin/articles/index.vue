<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s" v-if="articles.length > 0">
                    <div class="col-4 mb-40" v-for="article in articles" :key="article._id">
                        <article-block
                            :title="article.title"
                            :category="article.category"
                            :image="article.thumbnail"
                            :path="localePath({ name: 'admin-articles-id', params: { id: article._id } })"
                        />
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'admin-articles-id', params: { id: 'new' } })
                    }"
                >
                    Créer un article
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import { } from 'instant-coffee-core'
import { sortDate } from '@/utils/base'

export default {
    name: 'ArticlesPage',
    layout: 'admin',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: {}
        })
    },
    computed: {
        articles () { return this.$store.getters['articles/find']() },
    },
    head () {
        let meta = {
            title: 'Articles du blog'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>