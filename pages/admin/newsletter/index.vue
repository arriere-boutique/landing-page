<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                
                <div class="Block bg-bg-light p-20">
                    <div class="d-flex fx-justify-between ft-m pv-3" v-for="subscriber in users" :key="subscriber._id">
                        <p class="ft-medium">{{ subscriber.email }}</p>

                        <p>{{ subscriber.frequency }} <span class="ml-20 color-ft-weak">{{ subscriber.createdAt }}</span></p>
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