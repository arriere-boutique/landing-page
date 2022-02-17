<template>
    <landing-module
        :metadata="$options.metadata"
        :form-data="formData"
        :module="module"
        :title="`${this.reviews.length - formData.disabled.length} évaluations affichées`"
    >

        <label class="fx-center bg-bg-light br-s p-20 mb-10" v-for="review in reviews" :key="review._id" >
            <div>
                <p class="ft-s" v-html="review.comment"></p>
                <p class="ft-s-medium mt-10">{{ review.user.name }}</p>
            </div>

            <div class="p-10">
                <toggle-base :value="!formData.disabled.includes(review._id)" @input="(v) => toggleReview(v, review)" />
            </div>
        </label>
    </landing-module>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin.js'
import { ToggleBase } from 'instant-coffee-core'

export default {
    name: 'RatingBlockEdit',
    mixins: [ LandingModuleMixin ],
    components: { ToggleBase },
    metadata: {
        name: 'rating-block',
        fa: 'stars',
        color: 'sunset',
        title: `Évaluations de boutique`,
        description: `Affiche les évaluations positives de ta boutique.`,
        requirements: ['shop'],
        default: {
            disabled: []
        }
    },
    computed: {
        reviews () { return this.$store.getters['shop/allReviews'] }
    },
    methods: {
        toggleReview (v, review) {
            if (v) {
                this.formData.disabled = this.formData.disabled.filter(v => v !== review._id)
            } else {
                this.formData.disabled = [ ...this.formData.disabled, review._id ]
            }
        }
    }
}
</script>

<style>

</style>