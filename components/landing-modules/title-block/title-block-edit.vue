<template>
    <div class="LandingModule is-ice">
        <div class="LandingModule_header">
            <p>Texte</p>
            <p><i class="fal fa-arrows-up-down-left-right"></i></p>
        </div>

        <div>
            <input-base label="Titre" v-model="formData.title" :attrs="{ required: true }" />
            <textarea v-model="formData.paragraph" class="mt-10" placeholder="Texte"></textarea>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'ListLinkEdit',
    components: { InputBase, SelectBase, ToggleBase },
    props: {
        module: { type: Object, default: () => ({}) }
    },
    data: () => ({
        formData: {
            title: '',
            paragraph: ''
        }
    }),
    watch: {
        module: {
            immediate: true,
            handler (v) {
                if (JSON.stringify(this.formData) == JSON.stringify(v)) return
                this.formData = { ...v }
            }
        },
        formData: {
            deep: true,
            handler (v) {
                this.$emit('input', this.formData)
            }
        },
    }
}
</script>

<style>

</style>