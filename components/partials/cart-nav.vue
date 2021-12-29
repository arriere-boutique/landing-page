<template>
    <div class="CartNav" :class="{ 'is-active': isActive }">
        <div class="CartNav_hide" @click="toggleCart"></div>
        <div class="CartNav_container p-30">
            <div>
                <div class="ft-2xl d-flex fx-align-center fx-justify-between">
                    <p class="ft-l-medium">
                        <i class="fal fa-shopping-cart mr-5"></i> Mon panier
                    </p>

                    <i class="fal fa-times" @click="toggleCart"></i>
                </div>

                <hr class="Separator mv-20">

                <cart-body />
            </div>

            <div>
                <hr class="Separator mv-20">

                <div class="d-flex fx-align-center fx-justify-between">
                    <div>
                        <div class="ft-2xl-medium" v-show="cart.items.length > 0">
                            <p class="ft-xs color-ft-weak line-1">Au total :</p>
                            {{ cart.total }}€
                        </div>
                    </div>

                    <button-base @click="checkout" :class="{ 'is-disabled': cart.items.length < 1 }">Je commande !</button-base>
                </div>
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

<style lang="scss" scoped>
    .CartNav {
        position: fixed;
        z-index: 9999;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: flex;
    }

    .CartNav_hide {
        flex-grow: 1;
        transition: all 250ms ease;
    }

    .CartNav_container {
        position: absolute;
        top: 0;
        right: 0;
        width: 400px;
        flex-shrink: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: var(--color-bg-light);
        transform: translateX(100%);
        transition: all 250ms ease;
    }

    .CartNav.is-active {
        pointer-events: all;
        .CartNav_hide {
            background-color: rgba(0, 0, 0, 0.2);
        }
        .CartNav_container {
            transform: translateX(0%);
        }
    }
</style>