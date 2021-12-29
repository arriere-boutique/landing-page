<template>
    <div class="CartNav" :class="{ 'is-active': isActive }">
        <div class="p-30">
            <div class="ft-2xl d-flex fx-align-center fx-justify-between">
                <p class="ft-l-medium">
                    <i class="fal fa-shopping-cart mr-5"></i> Mon panier
                </p>

                <i class="fal fa-times" @click="toggleCart"></i>
            </div>

            <hr class="Separator mv-20">

            <cart-body />

            <hr class="Separator mv-20">

            <div class="d-flex fx-align-center fx-justify-between">
                <div class="ft-2xl-medium">
                    <p class="ft-xs color-ft-weak line-1">Au total :</p>
                    {{ cart.total }}€
                </div>

                <button-base @click="checkout">Je commande !</button-base>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'CartNav',
    props: {
        isActive: { type: Boolean, default: false }
    },
    computed: {
        cart () {
            return this.$store.getters['cart/get']
        }
    },
    methods: {
        toggleCart () {
            this.$store.commit('page/toggleCart')
        },
        async checkout () {
            let response = await this.$store.dispatch('cart/checkout')
        }
    }
}
</script>

<style>
    .CartNav {
        width: 400px;
        background: var(--color-bg-light);
        transform: translateX(100%);
        position: fixed;
        z-index: 9999;
        top: 0;
        right: 0;
        height: 100%;
        transition: all 250ms ease;
    }

    .CartNav.is-active {
        transform: translateX(0%);
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.2);
    }
</style>