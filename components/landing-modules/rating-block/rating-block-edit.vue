<template>
    <landing-module
        :metadata="$options.metadata"
        :form-data="formData"
        :title="``"
    >

    </landing-module>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'RatingBlockEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        dev: true,
        name: 'rating-block',
        fa: 'stars',
        color: 'sunset',
        title: `Évaluations de boutique`,
        description: `Affiche les évaluations positives de ta boutique.`,
        requirements: ['shop'],
        default: {}
    }
}
</script>

<style>

</style>