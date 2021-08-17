<template>
    <div class="EditorPage">
        <div class="Wrapper Wrapper--s pv-60">
            <div class="row">
                <div class="col-7">
                    <div class="EditorPage_image ActionMenu_hover" :style="{ '--background': cover }" @click="state.mediaLibrary = true">
                        <action-menu
                            :items="[
                                { icon: 'pencil-alt', onClick: () => state.mediaLibrary = true },
                                { icon: 'trash-alt', onClick: () => formData.image = '' },
                            ]"
                        />

                        <i class="fal fa-image-polaroid" v-show="!thumbnail"></i>
                    </div>

                    <input-base
                        label="Titre de l'événement"
                        class="mv-20"
                        :attrs="{
                            placeholder: 'Entrez un titre'
                        }"
                        v-model="formData.title"
                    />

                    <input-base
                        label="Lieu l'événement"
                        class="mv-20"
                        v-model="formData.location"
                    />

                    <input-base
                        label="Date de l'événement"
                        class="mv-20"
                        type="datetime-local"
                        v-model="formData.startDate"
                    />

                    <input-base
                        label="Lien Meetup"
                        class="mv-20"
                        v-model="formData.meetupLink"
                    />
                </div>
                <div class="col-5">
                    <div class="p-sticky" style="--offset: 40px;">
                        <entity-control
                            :status="formData.status"
                            @statusChange="(v) => formData.status = v"
                            @delete="deleteEvent"
                            @save="update"
                        />

                        <p class="color-ft-weak ft-xs text-center mt-15" v-if="lastUpdate && !isClone">
                            Modifié {{ lastUpdate }}.
                        </p>

                        <p class="color-ft ft-xs-medium text-center mt-15" v-if="!serverEvent || isClone">
                            Cet événement n'est pas encore enregistré.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <media-library
            :is-active="state.mediaLibrary"
            v-model="formData.image"
            @close="state.mediaLibrary = false"
        />
    </div>
</template>

<script>
import { InputBase, SelectBase } from '@instant-coffee/core'
import {} from '@/utils/base'
import moment from 'moment'

export default {
    name: 'EventsPage',
    components: { InputBase, SelectBase },
    layout: 'admin',
    async fetch () {
        this.$data._id = this.$route.params.id

        this.$data._id && (this.$data._id != 'new' || this.$route.query.clone) ? await this.$store.dispatch('events/get', this.$data._id) : {}
    },
    data: () => ({
        _id: '',
        state: {
            mediaLibrary: false
        },
        prevFormData: {},
        formData: {
            title: '',
            location: '',
            image: '',
            status: 'draft',
            startDate: new Date()
        }
    }),
    computed: {
        isClone () {
            return this.$route.query.clone ? true : false
        },
        lastUpdate () {
            return this.serverEvent && this.serverEvent.updatedAt ? moment(this.serverEvent.updatedAt).fromNow() : false
        },
        serverEvent () {
            return this.$store.getters['events/findOne']({ _id: this.$data._id }, true)
        },
        thumbnail () {
            let thumbnail = this.$data.formData.image && this.$data.formData.image.medias.find(m => m.size == 's')
            return thumbnail ? `url(${thumbnail.src})` : ''
        },
        cover () {
            let cover = this.$data.formData.image && this.$data.formData.image.medias.find(m => m.size == 'm')
            return cover ? `url(${cover.src})` : ''
        },
        changesMade () {
            return JSON.stringify(this.parseForm(this.$data.formData)) != JSON.stringify(this.parseForm(this.$data.prevFormData))
        }
    },
    watch: {
        serverEvent: {
            immediate: true,
            deep: true,
            handler (v) {
                let form = this.decodeForm(v)

                this.$data.formData = {
                    ...this.$data.formData,
                    ...form,
                    title: this.isClone ? '(clone) ' + form.title : form.title
                }

                this.$data.prevFormData = { ...this.$data.formData }
            }
        },
        ['formData.title']: {
            immediate: true,
            handler (v) {
               this.$store.commit('page/setProperty', { title: v })
            }
        }
    },
    mounted () {
        this.$data.formData = {
            ...this.decodeForm(this.$data.formData),
            ...this.decodeForm(this.serverEvent)
        }
    },
    methods: {
        decodeForm (form) {
            if (!form) return {}

            return {
                ...form
            }
        },
        parseForm (form) {
            return {
                ...form,
                image: form.image ? form.image._id : null
            }
        },
        async deleteEvent () {
            let response = await this.$store.dispatch('events/delete', this.$data._id)

            if (response.status == 1) {
                this.$router.push({ path: this.localePath('/events') })
            }
        },
        async update () {
            let response = await this.$store.dispatch('events/create', {
                _id: this.$data._id && this.$data._id != 'new' && !this.$route.query.clone ? this.$data._id : undefined,
                params: this.parseForm(this.$data.formData),
            })

            if (response.status == 1) {
                this.$data._id = response.data._id
                this.$router.push({ path: this.localePath({ name: 'events-id', params: { id: this.$data._id } }) })
            }

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })
        }
    }
}
</script>