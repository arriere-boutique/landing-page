<template>
    <div class="EditorPage">
        <div class="Wrapper pv-60">
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
                        label="Titre de la page"
                        class="mv-20"
                        :attrs="{
                            placeholder: 'Entrez un titre'
                        }"
                        v-model="formData.title"
                    />

                    <input-base
                        label="Introduction de la page"
                        type="textarea"
                        class="mv-20"
                        v-model="formData.excerpt"
                    />

                    <text-editor
                        v-model="formData.content"
                        v-if="!state.isLoading"
                    />
                </div>
                <div class="col-5">
                    <div class="p-sticky" style="--offset: 40px;">
                        <entity-control
                            :status="formData.status"
                            @statusChange="(v) => formData.status = v"
                            @delete="deleteEntity"
                            @save="update"
                        >
                            <input-base
                                label="ID de la page"
                                class="mt-10"
                                v-model="formData.slug"
                            />
                        </entity-control>
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
import { InputBase, SelectBase } from 'instant-coffee-core'
import {} from '@/utils/base'
import moment from 'moment'

export default {
    name: 'PagePage',
    layout: 'admin',
    components: { InputBase, SelectBase },
    async fetch () {
        this.$data._id = this.$route.params.id

        this.$data._id && (this.$data._id != 'new' || this.$route.query.clone) ? await this.$store.dispatch('pages/get', this.$data._id) : {}
    },
    data: () => ({
        _id: '',
        state: {
            isLoading: true,
            mediaLibrary: false
        },
        prevFormData: {},
        formData: {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image: '',
            status: 'draft'
        }
    }),
    computed: {
        isClone () {
            return this.$route.query.clone ? true : false
        },
        serverEntity () {
            return this.$store.getters['pages/findOne']({ _id: this.$data._id }, true)
        },
        changesMade () {
            return JSON.stringify(this.parseForm(this.$data.formData)) != JSON.stringify(this.parseForm(this.$data.prevFormData))
        },
        thumbnail () {
            let thumbnail = this.$data.formData.image && this.$data.formData.image.medias.find(m => m.size == 's')
            return thumbnail ? `url(${thumbnail.src})` : ''
        },
        cover () {
            let cover = this.$data.formData.image && this.$data.formData.image.medias.find(m => m.size == 'm')
            return cover ? `url(${cover.src})` : ''
        },
    },
    watch: {
        serverEntity: {
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

        this.$data.state.isLoading = false
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
                ...form
            }
        },
        async deleteEntity () {
            let response = await this.$store.dispatch('pages/delete', this.$data._id)

            if (response.status == 1) {
                this.$router.push({ path: this.localePath('/pages') })
            }
        },
        async update () {
            let response = await this.$store.dispatch('pages/create', {
                _id: this.$data._id && this.$data._id != 'new' && !this.$route.query.clone ? this.$data._id : undefined,
                params: this.parseForm(this.$data.formData),
            })

            if (response.status == 1) {
                this.$data._id = response.data._id
                this.$router.push({ path: this.localePath({ name: 'pages-id', params: { id: this.$data._id } }) })
            }

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })
        }
    }
}
</script>