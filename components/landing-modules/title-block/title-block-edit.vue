<template>
    <div class="LandingModule is-ice" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header title="Texte" :value="formData.position" @input="changePosition" :max="moduleCount" :order="order" :fa="$options.metadata.fa"  />

        <div class="d-flex fx-align-center">
            <div class="fx-grow ellipsis-1 color-ft ft-m-medium">
                "{{ formData.title }}"
            </div>
            <div class="d-flex fx-align-center">
                <link-base @click="$emit('delete')" class="mr-10" :modifiers="['pepper']" v-if="!formData.active">Supprimer</link-base>
                <link-base @click="isActive = true">Modifier</link-base>
                <toggle-base class="ml-10" :value="formData.active" @input="toggle" />
            </div>
        </div>

        <landing-module-popin :is-active="isActive" @reset="reset" @submit="submit" @close="isActive = false">
            <input-base label="Titre" v-model="formData.title" :attrs="{ required: true }" />
            <textarea v-model="formData.paragraph" class="mt-10" placeholder="Texte"></textarea>
        </landing-module-popin>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'ListLinkEdit',
    components: { InputBase, SelectBase, ToggleBase },
    metadata: {
        name: 'title-block',
        fa: 'text',
        color: 'ice',
        title: 'Zone de texte',
        description: `Affiche du texte sur ta page.`,
        default: {
            title: 'Premier texte',
            paragraph: 'Deuxième texte'
        }
    },
    props: {
        module: { type: Object, default: () => ({}) },
        moduleCount: { type: Number, default: 0 },
        order: { type: Number, default: 0 }
    },
    data: () => ({
        isActive: false,
        formData: {
            active: true,
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