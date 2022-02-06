<template>
    <landing-module
        :metadata="$options.metadata"
        :form-data="formData"
        :module="module"
        :title="``"
    >

    </landing-module>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin.js'
export default {
    name: 'CountdownEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        dev: true,
        name: 'countdown',
        fa: 'clock',
        color: 'ice',
        title: `Décompte`,
        description: `Affiche un décompte ainsi qu'un texte personnalisé.`,
        default: {}
    }
}
</script>

<style>

</style>