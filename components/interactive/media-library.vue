<template>
    <popin-base
        class="MediaLibrary"
        :modifiers="['panel']"
        :is-active="isActive"
        @close="onClose"
    >
        <template slot="content">
            <div class="p-40">
                <file-uploader @upload="onUpload" />

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
import { sortDate } from '@/utils/base'

export default {
    name: 'MediaLibrary', 
    async fetch () {
        await this.$store.dispatch('library/fetch', {
            type: 'mediaCollection',
            query: {}
        })
    },
    props: {
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