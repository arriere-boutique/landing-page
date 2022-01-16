<template>
    <div class="LandingModule is-pond">
        <div class="LandingModule_header">
            <p>Liste de boutons</p>
            <p><i class="fal fa-arrows-up-down-left-right"></i></p>
        </div>

        <div>
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
            links: []
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
    },
    methods: {
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