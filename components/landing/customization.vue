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
                <div class="d-flex">
                    <div class="bg-bg-xweak fx-grow br-m mr-20">
                        <input type="range" min="0" max="100" :value="formData.customization['background-opacity']" @input="(e) => updateCustomization('background-opacity', e.target.value)" :attrs="{ form: 'mainForm' }">
                    </div>

                    <p class="ft-m-medium">{{ formData.customization['background-opacity'] }}%</p>
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

<style>

</style>