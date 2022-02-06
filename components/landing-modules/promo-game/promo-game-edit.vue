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
    name: 'PromoCodeEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        dev: true,
        name: 'promo-game-edit',
        fa: 'trophy',
        color: 'precious',
        title: `Mini-jeu promotionnel`,
        description: `Fais gagner des codes promo grâce à un petit jeu.`,
        default: {}
    }
}
</script>

<style>

</style>