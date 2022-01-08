<template>
    <div class="FileUploader">
        <div class="FileUploader_body">
            <div class="FileUploader_input">
                <input-file @input="addFiles" />
            </div>

            <div class="FileUploader_upload" :class="{ 'is-active': files.length > 0 }">
                <div
                    v-for="(file, i) in files"
                    class="FileUploader_file"
                    :class="{ 'is-loaded': file.loaded, 'is-loading': file.loading }"
                    :key="i"
                >   
                    <div class="FileUploader_title">
                        <span class="ft-l mr-10">
                            <i class="fal" :class="[ getTypeIcon(file.raw.type) ]"></i>
                        </span>

                        {{ file.name }}
                    </div>
                    
                    <div class="FileUploader_status">
                        <i class="fal fa-times color-ft-weak" @click.stop="deleteFile(file.name)" v-if="!file.loading && !file.loaded && !state.loading"></i>
                        <i class="fal fa-spinner-third spin color-ft-weak" v-if="file.loading && !file.loaded"></i>
                        <i class="fal fa-check color-gum" v-if="file.loaded && !file.error"></i>
                        <i class="fal fa-times color-error" v-if="file.error"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="FileUploader_actions" :class="{ 'is-active': queuedFiles.length > 0 && !state.loading }">
            <div>
                <div class="ft-s color-ft-weak p-5" @click="files = []">Réinitialiser</div>
            </div>

            <button-base
                :modifiers="['s']"
                @click.stop="upload"
            >
                Uploader {{ queuedFiles.length }} fichier(s)
            </button-base>
        </div>

        <div class="FileUploader_actions" :class="{ 'is-active': !state.loading && loadedFiles.length > 0 && loadedFiles.length == files.length }">
            <div class="text-center ft-s fx-grow color-gum ph-20" v-if="status == 'success'">
                <i class="fal fa-check mr-5"></i> Les fichiers ont été chargés avec succès. Ils se trouvent dans la Bibliothèque de médias.
            </div>
            <div class="text-center ft-s fx-grow color-error ph-20" v-else-if="status == 'partial'">
                <i class="fal fa-exclamation-triangle mr-5"></i> Certains fichiers n'ont pas pu être chargés, veuillez réessayer.
            </div>
            <div class="text-center ft-s fx-grow color-error ph-20" v-else-if="status == 'fail'">
                <i class="fal fa-times mr-5"></i> Les fichiers n'ont pas pu être chargés, veuillez réessayer.
            </div>
        </div>
    </div>
</template>

<script>
import { setPropertyFor } from '@/utils/base'

export default {
    name: 'FileUploader',
    data: () => ({
        files: [],
        state: {
            loading: false
        }
    }),
    computed: {
        queuedFiles () { return this.$data.files.filter(f => !f.loaded && !f.loading) },
        loadedFiles () { return this.$data.files.filter(f => f.loaded) },
        status () {
            let status = 'success'
            if (this.$data.files.filter(f => f.error).length > 0) status = 'partial'
            if (this.$data.files.filter(f => f.error).length >= this.$data.files.length) status = 'fail'

            return status
        }
    },
    methods: {
        getTypeIcon (type) {
            let icon = 'fa-file-alt'

            if (type.indexOf('image') > -1) icon = 'fa-file-image'
            if (type.indexOf('html') > -1) icon = 'fa-file-code'

            return icon
        },
        addFiles (files) {
            this.$data.files = [ ...this.queuedFiles, ...files.map(file => ({
                name: file.name,
                raw: file,
                loaded: false,
                loading: false
            }))]
        },
        deleteFile (name) {
            this.$data.files = this.$data.files.filter(i => i.name != name)
        },
        async upload () {
            this.$data.state.loading = true

            for (const file of this.$data.files) {
                this.$data.files = setPropertyFor(this.$data.files, { 'name': file.name }, { 'loading': true })

                let result = await this.$store.dispatch('library/create', {
                    file: file.raw
                })

                if (!result) this.$data.files = setPropertyFor(this.$data.files, { 'name': file.name }, { 'error': true })
                this.$data.files = setPropertyFor(this.$data.files, { 'name': file.name }, { 'loaded': true })

                this.$emit('upload')
            }
            
            this.$data.state.loading = false
        }
    }
}
</script>