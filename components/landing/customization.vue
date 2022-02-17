<template>
    <div>
        <div class="p-20 b br-m mv-10">
            <div class="mb-20">
                <p class="ft-s-medium mb-10">Couleur de fond</p>
                <color-picker
                    :before="[ { hex: 'auto', display: this.photoColor, fa: 'wand-magic-sparkles' } ]"
                    :value="formData.customization['background-color']"
                    @input="setColorPicker"
                />
            </div>

            <div class="mb-20">
                <p class="ft-s-medium mb-10">Transparence de l'image de fond</p>

                <div
                    class="Tag"
                    :class="[ formData.customization['background-opacity'] == transparency.value ? 'is-pond' : 'Tag--secondary' ]"
                    v-for="transparency in transparencies"
                    form="mainForm"
                    @click="updateCustomization('background-opacity', transparency.value)"
                    :key="transparency.value"
                >
                    {{ transparency.label }}
                </div>
            </div>

            <pexels-gallery @select="(v) => { setPhotoColor(v.avg_color); updateCustomization('background', { src: v.src.original, photographer: { url: v.photographer_url, name: v.photographer} }); updateCustomization('background-thumbnail', v.src.large) }"/>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'LandingCustomization',
    components: { InputBase, SelectBase, ToggleBase, },
    props: {
        formData: { type: Object }
    },
    data: () => ({
        photoColor: '',
        transparencies: [
            { label: 'Transparente', value: 100 },
            { label: '25%', value: 75 },
            { label: '50%', value: 50 },
            { label: '75%', value: 25 },
            { label: 'Opaque', value: 0 },
        ]
    }),
    computed: {


    },
    methods: {
        setColorPicker (value) {
            this.formData.customization = { ...this.formData.customization, ['background-color']: value == 'auto' ? this.photoColor : value }
        },
        setPhotoColor (value) {
            if (this.formData.customization['background-color'] == this.photoColor) this.setColorPicker(value)
            this.photoColor = value
        },
        updateCustomization (key, v) {
            this.formData.customization = { ...this.formData.customization, [key]: v }
        },
    }
}
</script>

<style lang="scss" scoped>
    .range {
        touch-action: none;
    }
</style>