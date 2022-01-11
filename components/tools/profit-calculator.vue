<template>
    <div>
        <div class="p-20 bg-pond-xweak br-m mt-20 is-pond">
            <p class="ft-l-bold mb-20"><i class="fal fa-box-full mr-3"></i> Prix payé par le client</p>

            <div class="row-xs mv-10">
                <div class="col-6" v-if="price">
                    <input-base label="Prix actuel" class="is-disabled" :value="price.amount / price.divisor" @mouseenter.native="(e) => $tOpen(`C'est le prix que tu as renseigné sur Etsy. Pour le modifier, rendez-vous là-bas !`, e)" @mouseleave.native="$tClose" /> 
                </div>
                <div class="col-6">
                    <input-base type="number" label="Simuler un prix" v-model="simulatedPrice" @mouseenter.native="(e) => $tOpen(`Tu peux tester des prix différents ici. Ils ne sont pas enregistrés.`, e)" @mouseleave.native="$tClose" />
                </div>
            </div>
            
            <div class="text-right ft-s-bold">
                <span class="ft-m-bold mr-5">Total</span>
                <span class="ft-3xl-bold">{{ totalPrice|round }}<span class="ft-s-bold">€</span></span>
            </div>
        </div>

        <div class="row-xs">
            <div class="col-6">
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
                        <span class="ft-3xl-bold">{{ totalShipping|round }}<span class="ft-s-bold">€</span></span>
                    </div>
                </div>

                <div class="p-20 bg-sunset-xweak br-m mt-10">
                    <p class="ft-l-bold mb-20"><i class="fal fa-coin mr-3"></i> Frais de plateforme</p>

                    <div class="d-flex fx-align-center fx-justify-between">
                        <p class="ft-m-medium">Frais de mise en ligne</p> <p>0.22<span class="ft-xs">€</span></p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-between">
                        <p class="ft-m-medium">Frais de transaction</p> <p>{{ etsyFee|round }}<span class="ft-xs">€</span></p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-between">
                        <p class="ft-m-medium">Frais de paiement</p> <p>{{ paymentFee|round }}<span class="ft-xs">€</span></p>
                    </div>
                    
                    <div class="text-right ft-s-bold">
                        <span class="ft-m-bold mr-5">Total</span>
                        <span class="ft-3xl-bold">{{ totalEtsyFees|round }}<span class="ft-s-bold">€</span></span>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <div class="p-20 bg-gum-xweak br-m mt-10 is-gum">
                    <p class="ft-l-bold mb-20"><i class="fal fa-brush mr-3"></i> Production</p>

                    <div class="d-flex fx-align-center mv-10" v-for="(material, i) in formData.materials" :key="material.id">
                        <input-base type="text" label="Designation" placeholder="Tissus, boutons..." v-model="material.label" />
                        <input-base class="mh-5" type="number" label="Coût" v-model="material.cost" />

                        <div class="Buttons d-flex fx-no-shrink">
                            <div class="Button" @click="() => deleteMaterial(i)" v-if="formData.materials.length > 1"><i class="fal fa-sm fa-trash-alt"></i></div>
                            <div class="Button ml-5" v-if="i == formData.materials.length - 1" @click="addMaterial"><i class="fal fa-plus"></i></div>
                        </div>
                    </div>
                    
                    <div class="text-right ft-s-bold">
                        <span class="ft-m-bold mr-5">Total</span>
                        <span class="ft-3xl-bold">{{ totalProduction }}<span class="ft-s-bold">€</span></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-30 bg-pond-xweak br-m mt-10">
            <div class="d-flex">
                <div class="fx-grow max-width-s">
                    <div class="d-flex">
                        <p class="ft-medium fx-grow">Total payé par le client</p>
                        <p class="ft-bold fx-no-shrink">{{ totalPrice|round }}<span class="ft-xs-bold">€</span></p>
                    </div> 
                    <div class="d-flex">
                        <p class="ft-medium fx-grow">Coûts totaux</p>
                        <p class="ft-bold fx-no-shrink">{{ totalCosts|round }}<span class="ft-xs-bold">€</span></p>
                    </div>
                </div>
                <div class="fx-no-shrink fx-grow text-right pl-30">
                    <p class="ft-5xl-bold">{{ totalRemaining|round }}<span class="ft-xl-bold">€</span></p>
                </div>
            </div>

            <line-chart
                class="mt-20"
                :total="totalPrice"
                :values="[
                    { label: 'Frais de plateforme', color: '--color-sunset', value: totalEtsyFees },
                    { label: `Frais d'expédition`, color: '--color-duck', value: totalShipping },
                    { label: 'Coûts de production', color: '--color-gum', value: totalProduction },
                ]"
            />
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'ProfitCalculator',
    components: { InputBase },
    props: {
        value: { type: Object },
        price: { type: [Object, Boolean], default: false }
    },
    data: () => ({
        updating: false,
        simulatedPrice: 0,
        formData: {
            shippingCost: 0,
            shippingMaterials: 0,
            materials: []
        }
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.updating = true

                this.formData = {
                    ...v
                }

                setTimeout(() => this.updating = false)
            }
        },
        formData: {
            deep: true,
            handler (v) {
                if (!this.updating) {
                    this.$emit('input', v)
                }
            }
        }
    },
    computed: {
        totalPrice () {
            return this.simulatedPrice ? this.simulatedPrice : (this.price.amount / this.price.divisor)
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
    methods: {
        deleteMaterial (i) {
            this.formData.materials.splice(i, 1)
        },
        addMaterial () {
            this.formData.materials.push({ id: Math.random(), label: '', cost: 0 })
        },
    }
}
</script>

<style>

</style>