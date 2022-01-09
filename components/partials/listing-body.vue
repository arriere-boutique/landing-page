<template>
    <div v-if="listing">
        <p class="ft-xl-bold">{{ listing.title }}</p>

        
        <div class="p-20 b br-m mt-30">
            <p class="ft-l-bold">Estimation du profit</p>

            <div class="p-20 bg-pond-xweak br-m mt-20 is-pond">
                <p class="ft-l-bold mb-20"><i class="fal fa-box-full mr-3"></i> Prix payé par le client</p>

                <div class="row-xs mv-10">
                    <div class="col-6">
                        <input-base label="Prix actuel" class="is-disabled" :value="listing.price.amount / listing.price.divisor" @mouseenter.native="(e) => $tOpen(`C'est le prix que tu as renseigné sur Etsy. Pour le modifier, rendez-vous là-bas !`, e)" @mouseleave.native="$tClose" /> 
                    </div>
                    <div class="col-6">
                        <input-base type="number" label="Simuler un prix" v-model="simulatedPrice" @mouseenter.native="(e) => $tOpen(`Tu peux tester des prix différents ici. Ils ne sont pas enregistrés.`, e)" @mouseleave.native="$tClose" />
                    </div>
                </div>
                
                <div class="text-right ft-s-bold">
                    <span class="ft-m-bold mr-5">Total</span>
                    <span class="ft-3xl-bold">{{ totalPrice|round }}</span>
                </div>
            </div>

            <div class="p-20 bg-duck-xweak br-m mt-10 is-duck">
                <p class="ft-l-bold mb-20"><i class="fal fa-truck mr-3"></i> Expédition</p>

                <div class="row-xs mv-10">
                    <div class="col-6">
                        <input-base type="number" label="Frais d'envoi" v-model="formData.shippingCost" @mouseenter.native="(e) => $tOpen(`Frais payés pour l'envoi du colis ou de la lettre.`, e)" @mouseleave.native="$tClose" />
                    </div>
                    <div class="col-6">
                        <input-base type="number" label="Coût fournitures" v-model="formData.shippingMaterials" />
                    </div>
                </div>
                
                <div class="text-right ft-s-bold">
                    <span class="ft-m-bold mr-5">Total</span>
                    <span class="ft-3xl-bold">{{ totalShipping|round }}</span>
                </div>
            </div>

            <div class="p-20 bg-gum-xweak br-m mt-10 is-gum">
                <p class="ft-l-bold mb-20"><i class="fal fa-brush mr-3"></i> Production</p>

                <div class="d-flex fx-align-center mv-10" v-for="(material, i) in formData.materials" :key="material.id">
                    <input-base type="text" label="Designation" placeholder="Tissus, boutons..." v-model="material.label" />
                    <input-base class="mh-10" type="number" label="Coût" v-model="material.cost" />

                    <div class="Buttons d-flex fx-no-shrink">
                        <div class="Button ml-5" @click="() => deleteMaterial(i)" v-if="formData.materials.length > 1"><i class="fal fa-sm fa-trash-alt"></i></div>
                        <div class="Button ml-5" v-if="i == formData.materials.length - 1" @click="addMaterial"><i class="fal fa-plus"></i></div>
                    </div>
                </div>
                
                <div class="text-right ft-s-bold">
                    <span class="ft-m-bold mr-5">Total</span>
                    <span class="ft-3xl-bold">{{ totalProduction }}</span>
                </div>
            </div>

            <div class="p-20 bg-sunset-xweak br-m mt-10">
                <p class="ft-l-bold mb-20"><i class="fal fa-coin mr-3"></i> Frais de plateforme</p>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Frais de mise en ligne</p> <p>0.22</p>
                </div>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Frais de transaction</p> <p>{{ etsyFee|round }}</p>
                </div>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Frais de paiement</p> <p>{{ paymentFee|round }}</p>
                </div>
                
                <div class="text-right ft-s-bold">
                    <span class="ft-m-bold mr-5">Total</span>
                    <span class="ft-3xl-bold">{{ totalEtsyFees|round }}</span>
                </div>
            </div>

            <div class="p-20 b br-m mt-10">
                {{ totalPrice|round }} - {{ totalCosts|round }} = {{ totalRemaining|round }} (soit {{ totalRemainingPercentage|round }}% du prix payé)
            </div>

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
        },
        totalPrice () {
            return this.simulatedPrice ? this.simulatedPrice : (this.listing.price.amount / this.listing.price.divisor)
        },
        totalShipping () {
            let total = parseFloat(this.formData.shippingCost) + parseFloat(this.formData.shippingMaterials)
            return total ? total : 0
        },
        totalProduction () {
            return this.formData.materials.reduce((total, current) => total += (parseFloat(current.cost) ? parseFloat(current.cost) : 0), 0)
        },
        etsyFee () {
            return this.totalPrice * 0.06
        },
        paymentFee () {
            return (this.totalPrice * 0.048) + 0.36
        },
        totalEtsyFees () {
            return 0.22 + this.etsyFee + this.paymentFee
        },
        totalCosts () {
            return this.totalProduction + this.totalShipping + this.totalEtsyFees
        },
        totalRemaining () {
            return this.totalPrice - this.totalCosts
        },
        totalRemainingPercentage () {
            return Math.round((1 - (this.totalCosts / this.totalPrice)) * 10000) / 100
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
        deleteMaterial (i) {
            this.formData.materials.splice(i, 1)
        },
        addMaterial () {
            this.formData.materials.push({ id: Math.random(), label: '', cost: 0 })
        },
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
        width: 70px;
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