<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s" v-if="upcomingEvents.length > 0">
                    <div class="col-6 mb-40" v-for="event in upcomingEvents" :key="event._id">
                        <event-block
                            v-bind="event"
                        />
                    </div>
                </div>
                
                <div class="mt-30" v-if="draftEvents.length > 0">
                    <p class="Title mb-20">En préparation</p>
                    <div class="row-s">
                        <div class="col-6 mb-40" v-for="event in draftEvents" :key="event._id">
                            <event-block
                                v-bind="event"
                            />
                        </div>
                    </div>
                </div>

                <div class="mt-30" v-if="pastEvents.length > 0">
                    <p class="Title mb-20">Événements passés</p>
                    <div class="row-s">
                        <div class="col-4 mb-0" v-for="event in pastEvents" :key="event._id">
                            <event-block
                                v-bind="event"
                                :modifiers="['s']"
                            />
                        </div>
                    </div>
                </div>

                <div class="mt-30" v-if="hiddenEvents.length > 0">
                    <p class="Title mb-20">Événements cachés</p>
                    <div class="row-s">
                        <div class="col-4 mb-30" v-for="event in hiddenEvents" :key="event._id">
                            <event-block
                                v-bind="event"
                                :modifiers="['s']"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    tag="nuxt-link"
                    :modifiers="['light']"
                    icon-before="plus"        
                    :attrs="{
                        to: localePath({ name: 'events-id', params: { id: 'new' } })
                    }"
                >
                    Créer un événement
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from '@instant-coffee/core'
import { sortDate } from '@/utils/base'

export default {
    name: 'EventsPage',
    layout: 'admin',
    async fetch () {
        await this.$store.dispatch('events/fetch', {
            query: {}
        })
    },
    components: { InputBase },
    computed: {
        events () { return sortDate(this.$store.getters['events/find'](), 'startDate') },
        upcomingEvents () { return this.events.filter(item => item.status == 'published' && item.startDate.isAfter(new Date())) },
        pastEvents () { return this.events.filter(item => item.status == 'published' && item.startDate.isBefore(new Date())) },
        draftEvents () { return this.events.filter(item => item.status == 'draft') },
        hiddenEvents () { return this.events.filter(item => item.status == 'hidden') },
    },
    head () {
        let meta = {
            title: 'Événements'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>