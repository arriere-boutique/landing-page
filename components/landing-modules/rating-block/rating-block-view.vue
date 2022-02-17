<template>
    <div class="Reviews">
        <transition tag="div" class="Reviews_container" name="fade">
            <rating-block-review v-bind="activeReview" @next="next" :key="activeReview._id" />
        </transition>
    </div>
</template>

<script>
import RatingBlockReview from './rating-block-review.vue'

export default {
    name: 'RatingBlockView',
    components: { RatingBlockReview },
    props: {
        disabled: { type: Array },
        shop: { type: Object }
    },
    data: () => ({
        current: 0
    }),
    computed: {
        activeReview () {
            return this.reviews[this.current]
        },
        reviews () {
            return this.shop.reviews && this.shop.reviews.filter(r => r.rating >= 5 && r.comment && !this.disabled.includes(r._id))
        }
    },
    created () {
        this.current = this.$randomBetween(0, this.reviews.length - 1)
    },
    methods: {
        next () {
            this.current = this.current >= this.reviews.length - 1 ? 0 : this.current + 1
        }
    }
}
</script>

<style lang="scss" scoped>
    .Reviews {
        padding: 20px;
        border-radius: 10px;
        background: var(--color-bg-light);
        color: var(--color-ft);
        text-align: left;
        overflow: hidden;
        position: relative;
    }
</style>