<template>
    <div>
        <div class="d-flex mv-20" v-for="(item, i) in cart.items" :key="i">
            <div class="col-3">
                <div class="CartBody_image" :style="{ backgroundImage: `url(${item.cover})` }"></div>
            </div>
            <div class="fx-grow pl-10">
                <p class="ft-m-bold ellipsis-1">{{ item.title }}</p>
                <p class="color-ft-weak ft-italic">{{ item.variation.title }}</p>

                <div class="d-flex fx-align-center fx-justify-between mt-15">
                    <input-base class="InputBase--s width-3xs" :helpers="['number']" min="1" type="number" :value="item.quantity" />
                    <p class="ft-m ml-5">{{ Math.round((item.price * item.quantity) * 100) / 100 }}€</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase } from '@instant-coffee/core'

export default {
    name: 'CartBody',
    components: { InputBase },
    computed: {
        cart () {
            return this.$store.getters['cart/get']
        }
    }
}
</script>

<style lang="scss" scoped>
    .CartBody_image {
        background-position: center;
        background-size: cover;
        border-radius: 4px;

        &::before {
            content: '';
            display: block;
            padding-bottom: 100%;
        }
    }
</style>