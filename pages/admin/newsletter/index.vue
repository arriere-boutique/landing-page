<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">

                <div v-for="subscriber in users" :key="subscriber._id">
                    {{ subscriber.email }}

                    {{ subscriber.frequency }}

                    {{ subscriber.createdAt }}
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
        let response = await this.$store.dispatch('subscribe/fetch')
        this.$data.subscribers = response.data
    },
    data: () => ({
        subscribers: []
    }),
    computed: {
        users () {
            return this.$data.subscribers.map(sub => ({
                ...sub,
                createdAt: moment(sub.createdAt).format('D MMM YYYY H:mm')
            }))
        }
    },
    head () {
        let meta = {
            title: 'Gazette'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>