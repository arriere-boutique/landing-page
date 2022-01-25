<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                
                <div class="">
                    <div class="ft-m p-15 mv-10 bg-bg-light br-s" v-for="user in users" :key="user._id">
                        <div class="d-flex fx-justify-between">
                            <p class="ft-medium">{{ user.email }}</p>
                            <p>{{ user.name }} <span class="ml-20 color-ft-weak">{{ $moment(user.createdAt).format('DD MMM hh:mm') }}</span></p>
                        </div>

                        <div class="d-flex fx-align-center mv-5" v-for="shop in user.shops" :key="shop._id">
                            <i class="fal fa-arrow-turn-down-right mh-10"></i>

                            <link-base :href="shop.link" target="_blank">{{ shop.name }}</link-base>

                            <i class="fal fa-clipboard mr-5 ml-20"></i> {{ shop.listings.length }}
                            <i class="fal fa-receipt mr-5 ml-20"></i> {{ shop.orders.length }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="Page_side">
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsletterPage',
    layout: 'admin',
    async fetch () {
        let response = await this.$store.dispatch('user/fetch')
        this.data = response.data
    },
    data: () => ({
        data: []
    }),
    computed: {
        users () {
            return this.data.filter(u => u.role !== 'guest').sort((a, b) => this.$moment(b.createdAt).format('YYYYMMDD') - this.$moment(a.createdAt).format('YYYYMMDD'))
        }
    },
    head () {
        let meta = {
            title: 'Utilisateurs'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>