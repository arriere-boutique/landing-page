<template>
    <div class="LandingModule" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header title="Liste de boutons" :value="formData.position" @input="changePosition" :max="moduleCount" :order="order" :fa="$options.metadata.fa" />
        
        <div class="d-flex fx-align-center">
            <div class="fx-grow ellipsis-1 color-ft ft-m-medium">
                <i class="fal fa-link mr-5"></i> {{ formData.links.filter(b => b.active).length }} bouton(s)
            </div>
            <div>
                <link-base @click="isActive = true">Modifier</link-base>
            </div>
        </div>
        
        <landing-module-popin :is-active="isActive" @reset="reset" @submit="submit" @close="isActive = false">
            <div class="d-flex fx-align-center mv-10" v-for="link in formData.links" :key="link.id">
                <input-base type="text" label="Texte du lien" :value="link.label" :attrs="{ required: true }" @input="(v) => updateLink(link.id, { ...link, label: v })"/>
                <input-base type="text" class="ml-10" label="Lien" :value="link.href" :attrs="{ required: true }" @input="(v) => updateLink(link.id, { ...link, href: v })"/>

                <div class="Buttons d-flex fx-no-shrink ml-10">
                    <toggle-base :value="link.active" @input="(v) => updateLink(link.id, { ...link, active: v })" />

                    <div class="Button round bg-bg-light b ml-10" @click="() => deleteLink(link.id)" v-if="formData.links.length > 1"><i class="fal fa-sm fa-trash-alt"></i></div>
                </div>
            </div>

            <div class="text-right mt-5">
                <link-base fa="plus" @click.native.prevent="addLink">Ajouter un lien</link-base>
            </div>
        </landing-module-popin>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'ListLinkEdit',
    components: { InputBase, SelectBase, ToggleBase },
    metadata: {
        name: 'link-list',
        fa: 'link',
        color: 'pond',
        title: 'Liste de boutons',
        description: `Affiche une liste de liens sous forme de boutons.`,
        default: {
            links: [
                { id: Math.random(), label: 'Mon lien', href: 'https://arriere-boutique.fr', active: true }
            ]
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
            links: []
        }
    }),
    watch: {
        module: {
            immediate: true,
            deep: true,
            handler (v) {
                if (JSON.stringify(this.formData) == JSON.stringify(v)) return
                this.formData = { ...v }
            }
        }
    },
    methods: {
        changePosition (position) {
            this.$emit('input', { ...this.formData, position })
        },
        reset () {
            this.formData = { ...this.module }
        },
        submit () {
            this.$emit('input', this.formData)
        },
        addLink () {
            this.formData.links = [ ...this.formData.links, {
                id: Math.random(),
                label: '',
                href: '',
                active: true
            } ]
        },
        deleteLink (id) {
            this.formData.links = this.formData.links.filter(l => l.id != id)
        },
        updateLink (id, v) {
            this.formData.links = this.formData.links.map(l => l.id == id ? v : l)
        },
    }
}
</script>

<style>

</style>