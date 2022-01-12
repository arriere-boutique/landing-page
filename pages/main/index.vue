<template>
    <div class="HomePage">
        Home
    </div>
</template>

<script>
import blob1 from '@/assets/img/blob/blob-home.jpg'

export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: { status: 'published' }
        })
    },
    data: () => ({
        assets: { blob1 }
    }),
    head () {
        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: `J'ai créé l'Arrière Boutique pour te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.` }
            ]
        }

        this.$store.commit('page/setColor', 'gum')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>