<template>
    <div
        class="EventBlock ActionMenu_hover"
        :class="[{ 'is-past': isPast }, ...$modifiers ]"
        :style="{ '--image': `url('${thumbnail}')` }"
    >
        <action-menu
            v-bind="allActions"
        />
        
        <div class="EventBlock_container">
            <div class="EventBlock_image">
                <div class="EventBlock_tags">
                    <div class="Tag" v-if="status && status !== 'published'">{{ $t(`entities.event.status.${status}`) }}</div>
                </div>
            </div>

            <div class="EventBlock_content">
                <p class="EventBlock_title" v-if="title">{{ title }}</p>

                <div class="EventBlock_details row-xs">
                    <div class="col-6" v-if="location">
                        <p class="EventBlock_detail" v-if="location"><i class="fal fa-map-marker-alt mr-3"></i> {{ location }}</p>
                    </div>
                    <div class="col-6" v-if="startDate">
                        <p class="EventBlock_detail" v-if="startDate"><i class="fal fa-calendar mr-3"></i> {{ startDate.fromNow() }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from '@instant-coffee/core'

export default {
    name: 'EventBlock',
    mixins: [ ModifiersMixin ],
    props: {
        _id: { type: String, default: '' },
        title: { type: String, default: '' },
        location: { type: String, default: '' },
        thumbnail: { type: String, default: '' },
        meetupLink: { type: String, default: '' },
        status: { type: String, default: '' },
        actions: { type: Array, default: () => [] },
        startDate: { type: [Object, Boolean], default: false }
    },
    computed: {
        isPast () {
            return this.$props.startDate && this.$props.startDate.isBefore(new Date())
        },
        allActions () {
            return {
                items: [
                    { icon: 'pencil-alt', attrs: {
                        tag: 'nuxt-link',
                        attrs: {
                            to: this.localePath({ name: 'events-id', params: { id: this.$props._id } })
                        }
                    } }
                ],
                subItems: [
                    { label: 'Meetup', attrs: {
                        tag: 'a',
                        attrs: {
                            target: '_blank',
                            href: this.$props.meetupLink
                        }
                    } },
                    { label: 'Cloner', attrs: {
                        tag: 'nuxt-link',
                        attrs: {
                            to: this.localePath({ name: 'events-id', params: { id: this.$props._id }, query: { clone: true } })
                        }
                    } },
                    { label: 'Supprimer', onClick: () => {
                        this.$store.commit('utils/confirm', { text: `Vraaaiment ?`, confirm: { text: 'Supprimer', modifiers: ['s', 'error'], callback: this.onDelete } })
                    } },
                ]
            }
        }
    },
    methods: {
        async onDelete () {
            await this.$store.dispatch('events/delete', this.$props._id)
        }
    }
}
</script>