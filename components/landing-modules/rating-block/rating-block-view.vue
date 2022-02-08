<template>
    <div class="Reviews">
        <div class="Reviews_sizer">
            <div v-for="review in reviews" :key="review._id">
                <div class="mb-20 ft-s">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                
                <p class="ft-m">{{ review.comment }}</p>
                <p class="ft-s-bold mt-10">{{ review.user.name }}</p>
            </div>
        </div>
        <transition-group tag="div" class="Reviews_container" name="fade-h">
            <div class="Review_item" v-for="(review, i) in reviews" :key="review._id" v-show="i == current">
                <div>
                    <div class="mb-20 ft-s">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                
                    <p class="ft-m">{{ review.comment }}</p>
                    <p class="ft-s-bold mt-10">{{ review.user.name }} <span class="ft-s ft-italic color-ft-weak">via Etsy</span></p>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: 'RatingBlockView',
    props: {
        disabled: { type: Array },
        shop: { type: Object }
    },
    data: () => ({
        current: 0
    }),
    computed: {
        reviews () {
            return this.shop.reviews && this.shop.reviews.filter(r => r.rating >= 5 && r.comment && !this.disabled.includes(r._id))
        }
    },
    mounted () {
        setInterval(() => {
            this.next()
        }, 10000)
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

    .Reviews_sizer {
        display: flex;
        overflow: hidden;
        opacity: 0;

        & > div {
            width: 100%;
            flex-shrink: 0;
        }
    }

    .Reviews_container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100%;
        padding: 20px;
        display: flex;
    }

    .Review_item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
</style>