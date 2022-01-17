<template>
    <div class="LandingModule" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header :title="$options.metadata.title" :value="formData.position" @input="changePosition" :max="moduleCount" :order="order" :fa="$options.metadata.fa" />

        <landing-module-actions :is-active="formData.active" @open="isActive = true" @toggle="toggle" @delete="$emit('delete')">
            <i class="fal fa-link mr-5"></i> {{ module.links.filter(b => b.active).length }} bouton(s)
        </landing-module-actions>
        
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
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'ListLinkEdit',
    mixins: [ LandingModuleMixin ],
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
        }
    }
}
</script>

<style>

</style>