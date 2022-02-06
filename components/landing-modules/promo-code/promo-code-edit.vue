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
        name: 'promo-code',
        fa: 'badge-percent',
        color: 'precious',
        title: `Code promotionnel`,
        description: `Mets en avant un code promotionnel avec un décompte.`,
        default: {}
    }
}
</script>

<style>

</style>