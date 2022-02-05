<template>
    <div class="EditorPage">
        <div class="p-60">
            <div class="row">
                <div class="col-8">
                    <div class="EditorPage_image ActionMenu_hover" :style="{ '--background': cover }" @click="state.mediaLibrary = true">
                        <action-menu
                            :items="[
                                { icon: 'pencil-alt', onClick: () => state.mediaLibrary = true },
                                { icon: 'trash-alt', onClick: () => formData.medias = '' },
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

                    <text-editor
                        v-model="formData.excerpt"
                        v-if="!state.isLoading"
                    />

                    <text-editor
                        class="mt-30"
                        v-model="formData.content"
                        @open-library="openLibrary"
                        v-if="!state.isLoading"
                    />
                </div>
                <div class="col-4">
                    <div class="p-sticky" style="--offset: 40px;">
                        <entity-control
                            :status="formData.status"
                            @statusChange="(v) => formData.status = v"
                            @delete="deleteEntity"
                            @save="update"
                        >
                            <select-base
                                class="mb-15"
                                label="Type"
                                :value="formData.type"
                                v-model="formData.type"
                                :options="TYPES"
                                :multiple="false"
                            />

                            <select-base
                                class="mb-15"
                                label="Catégorie"
                                :value="formData.category"
                                v-model="formData.category"
                                :options="CATEGORIES"
                                :multiple="false"
                            />
                        
                            <input-base
                                label="Lien externe"
                                class="mb-15"
                                v-model="formData.link"
                            />
                            
                            <div class="d-flex fx-align-center">
                                <input-base
                                    label="ID de la page"
                                    v-model="formData.slug"
                                />

                                <div @click="generateSlug" class="ml-10">
                                    <i class="fal fa-redo"></i>
                                </div>
                            </div>
                        </entity-control>
                    </div>
                </div>
            </div>
        </div>

        <media-library
            :is-active="state.mediaLibrary"
            v-bind="library.props"
            @input="library.onInput"
            @close="library.onClose"
            v-if="library.onInput"
        />
    </div>
</template>

<script>
const CATEGORIES = [
    { id: 0, label: `Actualités`, value: 'news' },
    { id: 1, label: 'Référencement SEO', value: 'seo' },
    { id: 2, label: 'Valeur perçue', value: 'value' },
    { id: 3, label: 'Identité de marque', value: 'identity' },
]

const TYPES = [
    { id: 0, label: `Article`, value: 'article' },
    { id: 1, label: 'Youtube', value: 'youtube' },
]

import { InputBase, SelectBase } from 'instant-coffee-core'
import slugify from 'slugify'

export default {
    name: 'ArticlePage',
    layout: 'admin',
    components: { InputBase, SelectBase },
    async fetch () {
        this.$data._id = this.$route.params.id

        this.$data._id && this.$data._id != 'new' && !this.$route.query.clone ? await this.$store.dispatch('articles/get', { query: { _id: this.$data._id } }) : {}
    },
    data: () => ({
        _id: '',
        CATEGORIES, TYPES,
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
            link: '',
            medias: null,
            category: 0,
            type: 0,
            status: 'draft'
        },
        library: {}
    }),
    computed: {
        isClone () {
            return this.$route.query.clone ? true : false
        },
        serverEntity () {
            return this.$store.getters['articles/findOne']({ _id: this.$data._id }, true)
        },
        changesMade () {
            return JSON.stringify(this.parseForm(this.$data.formData)) != JSON.stringify(this.parseForm(this.$data.prevFormData))
        },
        thumbnail () {
            let thumbnail = this.$data.formData.medias && this.$data.formData.medias.medias.find(m => m.size == 's')
            return thumbnail ? `url(${thumbnail.src})` : ''
        },
        cover () {
            let cover = this.$data.formData.medias && this.$data.formData.medias.medias.find(m => m.size == 'm')
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
            ...this.decodeForm(this.serverEntity)
        }

        this.resetLibrary()

        this.$data.state.isLoading = false
    },
    methods: {
        resetLibrary () {
            this.$data.library = {
                props: {
                    value: this.$data.formData.medias
                },
                onInput: (v) => this.$data.formData.medias = v,
                onClose: () => this.$data.state.mediaLibrary = false
            }
        },
        openLibrary (options) {
            this.$data.library = {
                ...options,
                onClose: () => {
                    this.$data.state.mediaLibrary = false

                    if (options.onClose) options.onClose()

                    this.resetLibrary()
                }
            }

            this.$data.state.mediaLibrary = true
        },
        decodeForm (form) {
            if (!form) return {}

            return {
                ...form,
                category: CATEGORIES.find(i => i.value == form.category)?.id,
                type: TYPES.find(i => i.value == form.type)?.id,
            }
        },
        parseForm (form) {
            return {
                ...form,
                category: CATEGORIES.find(i => i.id == this.$data.formData.category).value,
                type: TYPES.find(i => i.id == this.$data.formData.type).value,
            }
        },
        generateSlug () {
            let slug = this.$data.formData.title
            this.$data.formData.slug = slugify(slug, { lower: true, strict: true })
        },
        async deleteEntity () {
            let response = await this.$store.dispatch('articles/delete', this.$data._id)

            if (response.status == 1) {
                this.$router.push({ path: this.localePath({ name: 'admin-articles' }) })
            }
        },
        async update () {
            let response = await this.$store.dispatch('articles/create', {
                _id: this.$data._id && this.$data._id != 'new' && !this.$route.query.clone ? this.$data._id : undefined,
                params: this.parseForm(this.$data.formData),
            })

            if (response.status == 1) {
                this.$data._id = response.data._id
                this.$router.push({ path: this.localePath({ name: 'admin-articles-id', params: { id: this.$data._id } }) })
            }

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })
        }
    }
}
</script>