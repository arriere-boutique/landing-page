<template>
    <div class="LandingModule is-ice" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header :title="$options.metadata.title" :value="formData.position" @input="changePosition" :max="moduleCount" :order="order" :fa="$options.metadata.fa"  />

        <landing-module-actions :is-active="formData.active" @open="isActive = true" @toggle="toggle" @delete="$emit('delete')">
            "{{ module.title }}"
        </landing-module-actions>
        
        <landing-module-popin :is-active="isActive" @reset="reset" @submit="submit" @close="isActive = false">
            <input-base label="Titre" v-model="formData.title" :attrs="{ required: true }" />
            <textarea v-model="formData.paragraph" class="mt-10" placeholder="Texte"></textarea>
        </landing-module-popin>
    </div>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'ListLinkEdit',
    mixins: [ LandingModuleMixin ],
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
    }
}
</script>

<style>

</style>