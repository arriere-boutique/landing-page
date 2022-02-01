<template>
    <div class="ProfitCalculator Grid" :class="[ $modifiers ]">
        <div class="Tile cw-12 bg-pond-xweak is-pond cw-12@s">
            <div>
                <p class="ft-l-bold mb-15"><i class="fal fa-box-full mr-3"></i> Prix payé par le client</p>

                <div class="row-xs mv-10" v-if="price">
                    <div class="col-6" >
                        <input-base label="Prix actuel" suffix="€" class="is-disabled" :value="price.amount / price.divisor">
                            <tooltip text="C'est le prix que tu as renseigné sur Etsy. Pour le modifier, rendez-vous là-bas !" />
                        </input-base>

                        <input-base type="number" class="mt-10" label="Frais d'expédition" suffix="€" v-model="formData.shippingPrice" />
                    </div>
                    <div class="col-6">
                        <input-base type="number" label="Simuler un prix" suffix="€" v-model="simulatedPrice">
                            <tooltip text="Tu peux tester des prix différents ici. Ils ne sont pas enregistrés." />
                        </input-base>
                    </div>
                </div>

                <div class="row-xs mv-10" v-else>
                    <div class="col-6">
                        <input-base type="number" label="Prix" suffix="€" v-model="simulatedPrice" />
                    </div>
                    <div class="col-6">
                        <input-base type="number" label="Frais d'expédition" suffix="€" v-model="formData.shippingPrice" />
                    </div>
                </div>
            </div>
            
            <div class="text-right ft-s-bold mt-20">
                <span class="ft-m-bold mr-5">Total</span>
                <span class="ft-3xl-bold line-1">{{ totalPrice|round }}<span class="ft-s-bold">€</span></span>
            </div>
        </div>

        <div class="Tile cw-6 bg-duck-xweak is-duck cw-12@s">
            <div>
                <p class="ft-l-bold mb-15"><i class="fal fa-truck mr-3"></i> Expédition</p>

                <input-base type="number" label="Frais d'envoi" suffix="€" v-model="formData.shippingCost">
                    <tooltip text="Ce que tu payes au transporteur (La Poste, Mondial Relay...)" />
                </input-base>

                <input-base type="number" class="mt-10" suffix="€" label="Coût fournitures" v-model="formData.shippingMaterials">
                    <tooltip text="Tes coûts pour l'expédition : colis en carte, lettre, ruban adhésif..." />
                </input-base>
            </div>
            
            <div class="text-right ft-s-bold mt-20">
                <span class="ft-m-bold mr-5">Total</span>
                <span class="ft-3xl-bold line-1">{{ totalShipping|round }}<span class="ft-s-bold">€</span></span>
            </div>
        </div>

        <div class="Tile cw-6 ch-2 bg-gum-xweak is-gum cw-12@s">
            <div>
                <p class="ft-l-bold mb-15"><i class="fal fa-brush mr-3"></i> Production <tooltip class="ml-5" text="Tes dépenses liées à la création de l'article : tissu, fil, papier..." /></p>

                <div class="d-flex fx-align-center mv-10" v-for="(material, i) in formData.materials" :key="material.id">
                    <input-base type="text" label="Designation" v-model="material.label" />

                    <input-base class="mh-5" type="number" label="Coût" suffix="€" v-model="material.cost" />

                    <div class="Buttons d-flex fx-no-shrink">
                        <div class="Button" @click="() => deleteMaterial(i)" v-if="formData.materials.length > 1"><i class="fal fa-sm fa-trash-alt"></i></div>
                        <div class="Button ml-5" v-if="i == formData.materials.length - 1" @click="addMaterial"><i class="fal fa-plus"></i></div>
                    </div>
                </div>
            </div>
            
            <div class="text-right ft-s-bold mt-20">
                <span class="ft-m-bold mr-5">Total</span>
                <span class="ft-3xl-bold line-1">{{ totalProduction|round }}<span class="ft-s-bold">€</span></span>
            </div>
        </div>

        <div class="Tile cw-6 bg-sunset-xweak cw-12@s">
            <div>
                <p class="ft-l-bold mb-10"><i class="fal fa-coin mr-3"></i> Frais de plateforme</p>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Mise en ligne <tooltip text="Pour chaque fiche produit mise en ligne, Etsy facture 0.20€ HT (soit ~0.22€ TTC)" /></p> <p>0.22<span class="ft-xs">€</span></p>
                </div>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Transaction <tooltip text="Etsy prélève 5% HT de commission sur le total de ta vente (frais de ports inclus), soit ~6% TTC." /></p> <p>{{ etsyFee|round }}<span class="ft-xs">€</span></p>
                </div>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Paiement <tooltip text="Frais prélevés lors du paiement d'une commande. 0.36€ TTC + 4.80% du total de ta vente." /></p> <p>{{ paymentFee|round }}<span class="ft-xs">€</span></p>
                </div>

                <div class="d-flex fx-align-center fx-justify-between">
                    <p class="ft-m-medium">Exploitation <tooltip text="Frais prélévés chez les vendeurs en Europe de 0.048% du total de la commande." /></p> <p>{{ europeFee|round }}<span class="ft-xs">€</span></p>
                </div>
            </div>
            
            <div class="text-right ft-s-bold mt-20">
                <span class="ft-m-bold mr-5">Total</span>
                <span class="ft-3xl-bold line-1">{{ totalEtsyFees|round }}<span class="ft-s-bold">€</span></span>
            </div>
        </div>


        <div class="Tile cw-12 bg-pond-xweak cw-12@s">
            <div class="d-flex fx-wrap">
                <div class="fx-grow">
                    <div class="d-flex">
                        <p class="ft-s fx-grow">Prix de l'article</p>
                        <p class="ft-s-medium fx-no-shrink">{{ articlePrice|round }}<span class="ft-xs-bold">€</span></p>
                    </div>

                    <div class="d-flex">
                        <p class="ft-s fx-grow">Frais d'expédition</p>
                        <p class="ft-s-medium fx-no-shrink" v-if="shippingPrice">{{ shippingPrice|round }}<span class="ft-xs-bold">€</span></p>
                        <p class="ft-s-medium fx-no-shrink" v-else>Gratuits</p>
                    </div>

                    <div class="d-flex mt-5">
                        <p class="ft-l-bold fx-grow">Total payé</p>
                        <p class="ft-xl-bold fx-no-shrink">{{ totalPrice|round }}<span class="ft-xs-bold">€</span></p>
                    </div> 

                    <hr class="Separator mv-10">

                    <div class="d-flex">
                        <p class="ft-s fx-grow">Coûts d'expédition</p>
                        <p class="ft-s-medium fx-no-shrink">{{ totalShipping|round }}<span class="ft-xs-bold">€</span></p>
                    </div>

                    <div class="d-flex">
                        <p class="ft-s fx-grow">Frais de plateforme</p>
                        <p class="ft-s-medium fx-no-shrink">{{ totalEtsyFees|round }}<span class="ft-xs-bold">€</span></p>
                    </div>

                    <div class="d-flex">
                        <p class="ft-s fx-grow">Coûts de production</p>
                        <p class="ft-s-medium fx-no-shrink">{{ totalProduction|round }}<span class="ft-xs-bold">€</span></p>
                    </div>

                    <div class="d-flex mt-5">
                        <p class="ft-l-bold fx-grow">Coûts totaux</p>
                        <p class="ft-xl-bold fx-no-shrink">{{ totalCosts|round }}<span class="ft-xs-bold">€</span></p>
                    </div>
                </div>
            </div>

            <div class="mt-20">
                <div class="d-flex fx-align-center text-right fx-justify-end">
                    <span class="round mr-10" :class="[ totalRemaining > 0 ? 'bg-emerald-weak' : 'bg-pepper-xweak' ]"><i class="fal fa-coin"></i></span>
                    <p class="ft-4xl-bold">{{ totalRemaining|round }}<span class="ft-xl-bold">€</span></p>
                </div>
                    
                <line-chart
                    class="mt-15"
                    :total="totalPrice"
                    :values="[
                        { label: 'Frais de plateforme', color: '--color-sunset', value: totalEtsyFees },
                        { label: `Frais d'expédition`, color: '--color-duck', value: totalShipping },
                        { label: 'Coûts de production', color: '--color-gum', value: totalProduction },
                    ]"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'ProfitCalculator',
    components: { InputBase },
    mixins: [ ModifiersMixin ],
    props: {
        value: { type: [Object, Boolean], default: false },
        price: { type: [Object, Boolean], default: false }
    },
    data: () => ({
        updating: false,
        simulatedPrice: 0,
        formData: {
            shippingPrice: 0,
            shippingCost: 0,
            shippingMaterials: 0,
            costs: {},
            materials: [
                { id: Math.random(), label: '', cost: 0 }
            ]
        }
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.updating = true

                this.formData = {
                    ...this.formData,
                    ...v
                }

                setTimeout(() => this.updating = false)
            }
        },
        formData: {
            deep: true,
            handler (v) {
                if (!this.updating) {
                    this.$emit('input', {
                        ...v,
                        costs: {
                            shipping: this.totalShipping,
                            production: this.totalProduction,
                            fees: this.totalEtsyFees,
                            totalCosts: this.totalCosts,
                            totalRemaining: this.totalRemaining
                        }
                    })
                }
            }
        }
    },
    computed: {
        articlePrice () {
            return parseFloat(this.simulatedPrice || !this.price ? this.simulatedPrice : (this.price.amount / this.price.divisor))
        },
        shippingPrice () {
            return parseFloat(this.formData.shippingPrice ? this.formData.shippingPrice : 0)
        },
        totalPrice () {
            return this.articlePrice + this.shippingPrice
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
        europeFee () {
            return this.totalPrice * 0.0048
        },
        totalEtsyFees () {
            return 0.22 + this.etsyFee + this.paymentFee + this.europeFee
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
    mounted () {
        if (!this.price && !this.simulatedPrice) this.simulatedPrice = 5

        this.$emit('input', {
            ...this.formData,
            costs: {
                shipping: this.totalShipping,
                production: this.totalProduction,
                fees: this.totalEtsyFees,
                totalCosts: this.totalCosts,
                totalRemaining: this.totalRemaining
            }
        })
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

<style lang="scss" scoped>


</style>