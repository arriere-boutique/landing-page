<template>
    <div class="LandingModule" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header :title="$options.metadata.title" :value="formData.position" @input="changePosition" :max="moduleCount" :order="order" :fa="$options.metadata.fa"  />

        <div class="d-flex fx-align-center">
            <div class="fx-grow ellipsis-1 color-ft ft-m-medium">
                {{ formData.items.length }} fiches sélectionnées
            </div>
            <div class="d-flex fx-align-center">
                <link-base @click="$emit('delete')" class="mr-10" :modifiers="['pepper']" v-if="!formData.active">Supprimer</link-base>
                <link-base @click="isActive = true">Modifier</link-base>
                <toggle-base class="ml-10" :value="formData.active" @input="toggle" />
            </div>
        </div>

        <landing-module-popin :is-active="isActive" @reset="reset" @submit="submit" @close="isActive = false">
            <input-base type="text" v-model="formData.title" />
            <listing-selector v-model="formData.items" />
        </landing-module-popin>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'ListingGridEdit',
    components: { InputBase, SelectBase, ToggleBase },
    metadata: {
        name: 'listing-grid',
        fa: 'shopping',
        color: 'sunset',
        title: `Grille d'articles Etsy`,
        description: `Affiche du texte sur ta page.`,
        default: {
            title: 'Découvrez ma boutique',
            items: []
        }
    },
    props: {
        module: { type: Object, default: () => ({}) },
        moduleCount: { type: Number, default: 0 },
        order: { type: Number, default: 0 }
    },
    data: () => ({
        isActive: false,
        formData: {}
    }),
    computed: {
    },
    watch: {
        module: {
            immediate: true,
            handler (v) {
                if (JSON.stringify(this.formData) == JSON.stringify(v)) return
                this.formData = { ...v }
            }
        }
    },
    methods: {
        toggle () {
            this.$emit('input', { ...this.formData, active: !this.formData.active })
        },
        changePosition (position) {
            this.$emit('input', { ...this.formData, position })
        },
        reset () {
            this.formData = { ...this.module }
        },
        submit () {
            this.$emit('input', this.formData)
        }
    }
}
</script>

<style>

</style>