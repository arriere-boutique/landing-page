<template>
    <div v-if="listing">
        <p class="ft-xl-bold">{{ listing.title }}</p>

        
        <div class="p-20 b br-m mt-30">
            <p class="ft-l-bold">Estimation du profit</p>

            <profit-calculator
                :price="listing.price"
                v-model="formData"
            />

            <div class="text-right">
                <button-base icon-before="floppy-disk" :modifiers="['gum']" :class="{ 'is-loading': isLoading }" @click="save">Sauvegarder</button-base>
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'ListingBody',
    components: { InputBase },
    props: {
        id: { type: String },
    },
    data: () => ({
        isLoading: false,
        simulatedPrice: 0,
        formData: {
            shippingCost: 0,
            shippingMaterials: 0,
            materials: []
        }
    }),
    computed: {
        listing () {
            return this.$store.getters['shop/listingById'](this.$props.id)
        }
    },
    watch: {
        listing: {
            immediate: true,
            handler (v) {
                if (!v) return 

                this.formData = {
                    ...this.formData,
                    ...v,
                    materials: v.materials.length > 0 ? [ ...v.materials ] : [
                        { id: Math.random(), label: '', cost: 0 }
                    ]
                }
            }
        }
    }, 
    methods: {
        async save () {
            this.isLoading = true

            await this.$store.dispatch('listings/update', {
                _id: this.listing._id,
                params: {
                    ...this.formData,
                    costs: {
                        shipping: this.totalShipping,
                        production: this.totalProduction,
                        fees: this.totalEtsyFees,
                        totalCosts: this.totalCosts,
                        totalRemaining: this.totalRemaining
                    }
                }
            })

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .Buttons {
        width: 65px;
    }
    .Button {
        height: 30px;
        width: 30px;
        flex-shrink: 0;
        background-color: var(--color-bg-light);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
</style>