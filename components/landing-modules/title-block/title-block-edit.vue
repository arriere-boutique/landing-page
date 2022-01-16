<template>
    <div class="LandingModule is-ice">
        <landing-module-header title="Texte" v-model="formData.position" :max="moduleCount" :order="order" />

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
        module: { type: Object, default: () => ({}) },
        moduleCount: { type: Number, default: 0 },
        order: { type: Number, default: 0 }
    },
    data: () => ({
        formData: {
            title: '',
            paragraph: '',
            position: 0,
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