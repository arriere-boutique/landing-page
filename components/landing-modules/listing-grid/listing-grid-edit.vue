<template>
    <div class="LandingModule" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header :title="$options.metadata.title" :value="formData.position" @input="changePosition" :max="moduleCount" :order="order" :fa="$options.metadata.fa"  />

        <landing-module-actions :is-active="formData.active" @open="isActive = true" @toggle="toggle" @delete="$emit('delete')">
            {{ module.items.length }} fiches sélectionnées
        </landing-module-actions>

        <landing-module-popin :is-active="isActive" @reset="reset" @submit="submit" @close="isActive = false">
            <input-base type="text" v-model="formData.title" />
            <listing-selector v-model="formData.items" />
        </landing-module-popin>
    </div>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'ListingGridEdit',
    mixins: [ LandingModuleMixin ],
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
    }
}
</script>

<style>

</style>