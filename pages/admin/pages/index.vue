<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s" v-if="pages.length > 0">
                    <div class="col-6 mb-40" v-for="page in pages" :key="page._id">
                        <nuxt-link tag="div" class="Block p-15" :to="localePath({ name: 'pages-id', params: { id: page._id } })">
                            <p class="ft-m-medium">{{ page.title }}</p>
                        </nuxt-link>
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'pages-id', params: { id: 'new' } })
                    }"
                >
                    Créer une page
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import { } from 'instant-coffee-core'
import { sortDate } from '@/utils/base'

export default {
    name: 'PagesPage',
    layout: 'admin',
    async fetch () {
        await this.$store.dispatch('pages/fetch', {
            query: {}
        })
    },
    computed: {
        pages () { return this.$store.getters['pages/find']() },
    },
    head () {
        let meta = {
            title: 'Pages'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>