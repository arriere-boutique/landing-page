<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <gallery-mosaic
                    :items="medias"
                    :height="200"
                    @delete="(v) => $store.commit('utils/confirm', { text: `Vraaaiment ?`, confirm: { text: 'Supprimer', modifiers: ['s', 'error'], callback: () => this.onDelete(v) } })"
                />
            </div>

            <!-- <div class="Page_side">

            </div> -->
        </div>
    </div>
</template>

<script>
import {} from 'instant-coffee-core'
import { sortDate } from '@/utils/base'

export default {
    name: 'MediasPage',
    layout: 'admin',
    async fetch () {
        await this.$store.dispatch('library/fetch', {
            type: 'mediaCollection',
            query: {}
        })
    },
    computed: {
        medias () {
            return sortDate(this.$store.getters['library/find'](), 'createdDate')
        }
    },
    methods: {
        onDelete (id) {
            this.$store.dispatch('library/delete', id)
        }
    },
    head () {
        let meta = {
            title: 'Bibliothèque de médias'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>