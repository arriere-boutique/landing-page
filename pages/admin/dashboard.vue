<template>
    <div>
        <div class="Wrapper p-relative pb-100">
            <div class="row-s fx-nowrap">
                <div class="col-grow">
                    <template v-if="upcomingEvents.length > 0">
                        <div class="row-xs">
                            <div class="col-4 mb-20" v-for="event in upcomingEvents" :key="event.id">
                                <event-block
                                    :modifiers="['s']"
                                    v-bind="event"
                                />
                            </div>
                        </div>
                    </template>

                    <template v-if="pastEvents.length > 0">
                        <h2 class="Title mt-40 mb-20">Événements passés</h2>
                        <div class="row-s">
                            <div class="col-6 mb-10" v-for="event in pastEvents" :key="event.id">
                                <event-block
                                    :modifiers="['s']"
                                    v-bind="event"
                                />
                            </div>
                        </div>
                    </template>

                    <div class="pv-100"></div>
                    <div class="pv-100"></div>
                </div>
                <div class="col-no-shrink width-xs">
                    <div class="p-15">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import {} from '@/utils/base'

export default {
    name: 'DashboardPage',
    layout: 'admin',
    async fetch () {
        await this.$store.dispatch('events/fetch', {
            query: {}
        })
    },
    computed: {
        user () { return this.$store.state.auth.user },
        events () { return this.$store.getters['events/find']() },
        upcomingEvents () {
            return this.events.filter(item => item.status == 'published' && item.startDate.isAfter(new Date()))
        },
        pastEvents () {
            return this.events.filter(item => item.status == 'published' && item.startDate.isBefore(new Date()))
        },
    },
    mounted () {

    },
    head () {
        let meta = {
            title: 'Tableau de bord',
            secondary: `Hello ${this.user.name}.`
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>