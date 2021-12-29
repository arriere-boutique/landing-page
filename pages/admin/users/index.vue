<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                
                <div class="Block bg-bg-light p-20">
                    <div class="d-flex fx-justify-between ft-m pv-3" v-for="user in users" :key="user._id">
                        <p class="ft-medium">{{ user.email }}</p>
                        <p>{{ user.name }} <span class="ml-20 color-ft-weak">{{ user.createdAt }}</span></p>
                    </div>
                </div>
            </div>

            <div class="Page_side">

            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

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
            return this.data.map(user => ({
                ...user,
                createdAt: moment(user.createdAt).format('D MMM YYYY H:mm')
            }))
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