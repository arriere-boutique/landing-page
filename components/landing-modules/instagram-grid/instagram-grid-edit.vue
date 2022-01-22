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
    name: 'PromoCodeEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        dev: true,
        name: 'instagram-grid',
        fa: 'camera-retro',
        color: 'gum',
        title: `Grille Instagram`,
        description: `Affiche un aperçu de ton compte Instagram.`,
        default: {}
    }
}
</script>

<style>

</style>