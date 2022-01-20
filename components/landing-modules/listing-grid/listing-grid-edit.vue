<template>
    <landing-module
        :metadata="$options.metadata"
        :form-data="formData"
        :title="`${module.items.length} sélectionnées`"
    >
        <input-base type="text" v-model="formData.title" />
        <listing-selector v-model="formData.items" />
    </landing-module>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'ListingGridEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        name: 'listing-grid',
        fa: 'grid-2',
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