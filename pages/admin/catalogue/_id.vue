<template>
    <div class="EditorPage">
        <div class="p-60">
            <div class="row">
                <div class="col-8">
                    <div class="row-s">
                        <div class="col-4">
                            <div class="EditorPage_image EditorPage_image--blob ActionMenu_hover" :style="{ '--background': cover }" @click="state.mediaLibrary = true">
                                <action-menu
                                    :items="[
                                        { icon: 'pencil-alt', onClick: () => state.mediaLibrary = true },
                                        { icon: 'trash-alt', onClick: () => formData.medias = '' },
                                    ]"
                                />

                                <i class="fal fa-image-polaroid" v-show="!thumbnail"></i>
                            </div>
                        </div>
                        <div class="col-6">
                            <input-base
                                label="Nom du produit"
                                v-model="formData.title"
                            />

                            <input-base
                                label="Sous-titre du produit"
                                class="mt-20"
                                v-model="formData.subtitle"
                            />

                            <input-base
                                label="Prix"
                                type="number"
                                :helpers="['number']"
                                class="mt-20"
                                v-model="formData.price"
                            />
                        </div>
                    </div>

                    <text-editor
                        class="mt-30"
                        v-model="formData.content"
                        @open-library="openLibrary"
                        v-if="!state.isLoading"
                    />

                    <div class="d-flex fx-align-center mt-20">
                        <input-base
                            label="Délai minimum"
                            type="number"
                            class="mr-5"
                            :helpers="['number']"
                            v-model="formData.deliveryMin"
                        />

                        <input-base
                            label="Délai maximum"
                            type="number"
                            :helpers="['number']"
                            v-model="formData.deliveryMax"
                        />

                        <p class="mh-10">OU</p>

                        <input-base
                            label="Détails livraison"
                            type="textarea"
                            v-model="formData.deliveryDelay"
                        />
                    </div>
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
    { id: 0, label: `Coaching`, value: 'coaching' },
    { id: 1, label: 'Critique', value: 'critique' },
    { id: 2, label: 'Studio', value: 'studio' }
]

import { InputBase, SelectBase } from '@instant-coffee/core'
import slugify from 'slugify'

export default {
    name: 'ProductPage',
    layout: 'admin',
    components: { InputBase, SelectBase },
    async fetch () {
        this.$data._id = this.$route.params.id

        this.$data._id && this.$data._id != 'new' && !this.$route.query.clone ? await this.$store.dispatch('products/get', { query: { _id: this.$data._id } }) : {}
    },
    data: () => ({
        _id: '',
        CATEGORIES,
        state: {
            isLoading: true,
            mediaLibrary: false
        },
        prevFormData: {},
        formData: {
            title: '',
            subtitle: '',
            price: 0,
            deliveryDetails: '',
            deliveryMin: 0,
            deliveryMax: 0,
            slug: '',
            excerpt: '',
            content: '',
            link: '',
            medias: null,
            category: 0,
            status: 'draft'
        },
        library: {}
    }),
    computed: {
        isClone () {
            return this.$route.query.clone ? true : false
        },
        serverEntity () {
            return this.$store.getters['products/findOne']({ _id: this.$data._id }, true)
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
                category: CATEGORIES.find(i => i.value == form.category)?.id
            }
        },
        parseForm (form) {
            return {
                ...form,
                category: CATEGORIES.find(i => i.id == this.$data.formData.category).value
            }
        },
        generateSlug () {
            let slug = this.$data.formData.title
            this.$data.formData.slug = slugify(slug, { lower: true, strict: true })
        },
        async deleteEntity () {
            let response = await this.$store.dispatch('products/delete', this.$data._id)

            if (response.status == 1) {
                this.$router.push({ path: this.localePath({ name: 'admin-catalogue' }) })
            }
        },
        async update () {
            let response = await this.$store.dispatch('products/create', {
                _id: this.$data._id && this.$data._id != 'new' && !this.$route.query.clone ? this.$data._id : undefined,
                params: this.parseForm(this.$data.formData),
            })

            if (response.status == 1) {
                this.$data._id = response.data._id
                this.$router.push({ path: this.localePath({ name: 'admin-catalogue-id', params: { id: this.$data._id } }) })
            }

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })
        }
    }
}
</script>