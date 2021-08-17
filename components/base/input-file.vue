<template>
    <label :for="id" class="InputFile">
        <div class="InputFile_title">
            <p class="ft-3xl">
                <i class="fal fa-cloud-upload color-ft-xweak mb-20"></i>
            </p>

            Sélectionner un ou plusieurs à uploader.
        </div>

        <input type="file" :id="id" @change="onChange" ref="input" multiple>
    </label>
</template>

<script>
export default {
    name: 'InputFile',
    props: {
        id: { type: String, default: 'input-file' }
    },
    methods: {
        onChange (e) {
            let files = Object.keys(e.target.files).map(key => e.target.files[key])
            this.$emit('input', files)
        }
    }
}
</script>