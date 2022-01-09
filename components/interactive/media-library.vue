<template>
    <popin-base
        :id="id"
        class="MediaLibrary"
        :modifiers="['panel']"
        :is-active="isActive"
        @close="onClose"
    >
        <template slot="content">
            <div class="p-40">
                <file-uploader @upload="onUpload" v-if="selected.length <= 0"/>
                
                <div v-else>
                    <p class="ft-m-bold mb-20">Sélectionnés</p>

                    <div class="row-xs">
                        <div class="col-4" v-for="(media, i) in selected" :key="i">
                            <div class="MediaLibrary_item" v-if="media.sizes">
                                <div class="MediaLibrary_itemImage" :style="{ backgroundImage: `url(${ media.sizes.s.src })` }">
                                </div>

                                <div class="p-10">
                                    <input-base label="Alt" class="mv-5" v-model="media.alt" />
                                    <input-base label="Titre" class="mv-5" v-model="media.title" />
                                    <input-base label="Source" class="mv-5" v-model="media.source" />
                                    <input-base label="Lien source" class="mv-5" v-model="media.sourceLink" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-40">
                    <p class="ft-m-bold mb-20">Bibliothèque de médias</p>

                    <gallery-mosaic :items="medias" :selector="true" :selected="selected" @select="onSelect" @deselect="onDeselect" />
                </div>
            </div>
        </template>

        <template slot="footer">
            <div>
                <p v-if="selected.length > 0" @click.stop="selected = []">Désélectionner tout</p>
            </div>

            <div class="d-flex fx-align-center">
                <template v-if="max > 1">{{ selected.length }} / {{ this.$props.max }}</template>

                <button-base class="ml-10" @click.native="onSubmit">
                    Valider
                </button-base>
            </div>
        </template>
    </popin-base>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import { sortDate } from '@/utils/base'

export default {
    name: 'MediaLibrary',
    components: { InputBase },
    async fetch () {
        await this.$store.dispatch('library/fetch', {
            type: 'mediaCollection',
            query: {}
        })
    },
    props: {
        id: { type: String, default: Math.random().toString() },
        value: { type: [String, Object] },
        max: { type: Number, default: 1 },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        selected: []
    }),
    computed: {
        medias () {
            return sortDate(this.$store.getters['library/find'](), 'createdDate')
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.$data.selected = v ? [ v ] : []
            }
        },
        isActive: {
            handler (v) {
                this.$data.selected = this.$props.value ? [ this.$props.value ] : []
            }
        }
    },
    methods: {
        async onUpload () {
            await this.$store.dispatch('library/fetch', { type: 'mediaCollection' })
        },
        onClose () {
            this.$emit('close')
        },
        onSelect (image) {
            if (this.$data.selected.length >= this.$props.max && this.$props.max == 1) {
                this.$data.selected = [ image ]
            } else if (this.$data.selected.length < this.$props.max) {
                this.$data.selected = [ ...this.$data.selected, image ]
            }
        },
        onDeselect (image) {
            this.$data.selected = this.$data.selected.filter(collection => collection._id != image._id)
        },
        onSubmit () {
            this.$emit('input', this.$props.max == 1 ? this.$data.selected[0] : this.$data.selected)
            this.onClose()   
        }
    }
}
</script>