<template>
    <landing-module
        :metadata="$options.metadata"
        :form-data="formData"
        :module="module"
        :title="`${module.items.length} sélectionnées`"
    >
        <input-base type="text" label="Titre" class="mb-20" v-model="formData.title" />
        <listing-selector v-model="formData.items" />
    </landing-module>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin.js'
export default {
    name: 'ListingGridEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        name: 'listing-grid',
        fa: 'grid-2',
        color: 'sunset',
        title: `Grille d'articles Etsy`,
        description: `Affiche plusieurs articles de ta boutique Etsy.`,
        requirements: ['shop'],
        default: {
            title: 'Découvrez ma boutique',
            items: []
        }
    }
}
</script>

<style>

</style>