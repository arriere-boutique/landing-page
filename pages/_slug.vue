<template>
    <div class="LandingPage">
        <landing-content :content="content" v-if="shop && content" />
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    layout: 'blank',
    async fetch () {
        let response = await this.$store.dispatch('shops/get', {
            query: { slug: this.subdomain.toLowerCase() }
        })
        
        if (response.length > 0) {
            this.shop = response[0]
            this.slug = this.$route.params.slug

            if (this.slug) {
                let content = await this.$store.dispatch('landings/get', {
                    update: false,
                    query: {
                        slug: this.slug,
                        shop: this.shop._id
                    }
                })

                console.log(content)

                if (content && content.length > 0) {
                    this.content = content[0]
                } else {
                    // this.$router.push(this.localePath({ name: 'slug', params: { slug: null }}))
                }
            }
        }
    },
    data: () => ({
        shop: null,
        content: null
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

<style lang="scss" scoped>
    .LandingPage {
        min-height: 100vh;
        display: flex;
    }
</style>