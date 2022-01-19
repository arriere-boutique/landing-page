<template>
    <div class="LandingModule" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header
            :subtitle="`${module.items.length} sélectionnées`"
            :value="formData.position"
            :max="moduleCount"
            :order="order"
            v-bind="$options.metadata"
            @input="changePosition"
        />

        <landing-module-actions
            :is-active="formData.active"
            @open="isActive = true"
            @toggle="toggle"
            @delete="$emit('delete')"
        />

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