<template>
    <div class="LandingPage">
        <landing-content :content="content" :shop="shop" v-if="shop && content" />
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

            let domain = this.$config.domains[this.shop.domain ? this.shop.domain : 0]
            
            if (!this.domain.includes(domain)) {
                this.shop = null
                return
            }

            let content = await this.$store.dispatch('landings/get', {
                update: false,
                query: {
                    slug: this.slug ? this.slug : 'home',
                    isActive: true,
                    shop: this.shop._id
                }
            })

            if (content && content.length > 0) {
                this.content = content[0]
            } else if (this.slug) {
                let content = await this.$store.dispatch('landings/get', {
                    update: false,
                    query: {
                        slug: 'home',
                        isActive: true,
                        shop: this.shop._id
                    }
                })

                if (content && content.length > 0) {
                    this.content = content[0]
                } else {
                    this.shop = null
                }   
            }
        }
    },
    data: () => ({
        shop: null,
        content: null
    }),
    computed: {
        domain () { return this.$store.state.domain },
        subdomain () { return this.$store.state.subdomain }
    },
    mounted () {
        if (!this.shop) window.location = this.$baseUrl
    },
    head () {
        let meta = {
            title: this.content && this.content.title ? this.content.title : `Bienvenue dans mon univers`,
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