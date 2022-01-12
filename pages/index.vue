<template>
    <div class="SlugPage">
        {{ subdomain }}
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    async fetch () {

    },
    data: () => ({

    }),
    computed: {
        subdomain () { return this.$store.state.subdomain }
    },
    head () {
        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: `` }
            ]
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>