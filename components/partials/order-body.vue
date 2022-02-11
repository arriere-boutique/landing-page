<template>
    <div :class="[]">
        <div class="">
            <p class="ft-xl-bold mb-20">
                Commande n°{{ order.id }}

                <span class="ft-m ml-5">du {{ $moment.unix(order.orderDate).format('D MMMM YYYY') }}</span>
            </p>

            <div class="OrderListing" :class="[ isItemPrepared(listing.id) ? 'is-emerald' : 'is-onyx' ]" v-for="listing in fullListings" :key="listing._id">
                <div>
                    <div class="image-block br-xs width-3xs" :style="{ backgroundImage: `url(${listing.images ? listing.images[0].thumbnail : 0})` }"></div>
                </div>

                <div class="fx-center ml-15">
                    <div>
                        <p class="ft-medium ellipsis-1 ellipsis-break">
                            {{ listing.title }}
                        </p>

                        <div class="fx-center mt-10">
                            <div>
                                <div v-for="variation in listing.variations.filter(l => l.valueId != null)" :key="variation.id">
                                    {{ variation.label }} :
                                    <b class="ft-m-medium">{{ variation.value }}</b>
                                </div>
                            </div>

                            <p class="Tag ml-10 fx-no-shrink" :class="[ listing.quantity > 1 ? 'is-gum' : 'is-onyx' ]">Quantité : {{ listing.quantity }}</p>
                        </div>

                        <div class="bg-ice-xweak p-15 br-s mt-15" v-if="getCustomization(listing)">
                            <p class="ft-s-bold mb-5">Personnalisation</p>
                            <div v-html="getCustomization(listing)"></div>
                        </div>
                    </div>
                </div>

                <div class="p-20 fx-center text-center p-20 bg-current-xweak br-s ml-20">
                    <button-base class="is-emerald" :modifiers="isItemPrepared(listing.id) ? ['s', 'current'] : ['s', 'secondary', 'current-mute']" icon-before="check" @click="toggleItem(listing.id)">
                        Préparé
                    </button-base>
                </div>
            </div>
        </div>

        <div class="mt-20 is-sunset bg-current-xweak p-20 br-s" v-if="order.message">
            <p class="ft-l-bold mb-20">
                Message de l'acheteur
            </p>
            
            <div v-html="order.message"></div>
        </div>

        <div class="mt-20 is-precious bg-current-xweak p-20 br-s" v-if="order.giftMessage">
            <p class="ft-l-bold mb-20">
                Message cadeau
            </p>
            
            <div v-html="order.giftMessage"></div>
        </div>

        <div class="mt-20 is-ice bg-current-xweak p-20 br-s">

            <div class="fx-center">
                <p class="ft-l-bold">
                    Suivi de la commande
                </p>
                
                <link-base @click="addNewTracking = true" v-if="order.shipments.length > 0">
                    Ajouter un code de suivi
                </link-base>
            </div>
                
            <div class="row-s mt-20">
                <div class="col-6">
                    <div class="Order_tracking bg-ice-weak br-s">
                        <div class="width-100" v-if="order.shipments.length > 0">
                            <div class="fx-center pv-10 ph-15 bg-bg-light br-s" v-for="shipment in order.shipments" :key="shipment.shipment">
                                <div class="ft-m-medium">
                                    {{ shipment.carrier_name }}

                                    <p class="ft-xs">
                                        Envoyé le {{ $moment.unix(shipment.shipment_notification_timestamp).format('D MMM YYYY') }}
                                    </p>
                                </div>

                                
                                <span class="Tag Tag--s ml-5 is-pond">{{ shipment.tracking_code ? shipment.tracking_code : `Pas de suivi` }}</span>
                            </div>
                        </div>

                        <div class="text-center" v-else>
                            <button-base :modifiers="['s', 'ice']"  icon-before="plus" @click="addNewTracking = true">
                                Ajouter un code de suivi
                            </button-base>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="bg-bg-light p-20 br-s">
                        <div class="ft-bold">{{ order.name }}</div>
                        <div>{{ order.adress1 }}</div>
                        <div v-if="order.adress2">{{ order.adress2 }}</div>
                        <div class="text-upper">{{ order.zip }} {{ order.city }}</div>
                        <div v-if="order.state">{{ order.state }}</div>
                        <div>{{ order.country }}</div>
                    </div>
                </div>
            </div>

            <transition name="fade">
                <div class="mt-20 p-20 bg-bg-light br-s" v-show="addNewTracking">
                    <div class="fx-center">
                        <p class="ft-m-bold">
                            Nouveau code de suivi
                        </p>

                        <div class="ft-l c-pointer" @click="addNewTracking = false">
                            <i class="fal fa-times"></i>
                        </div>
                    </div>
                    
                    <div class="d-flex mt-30">
                        <div class="fx-grow mr-30">
                            <input-base label="Code de suivi" v-model="formData.tracker.trackingCode" />

                            <div class="mt-10">
                                <div class="Tag Tag--m mr-5 mb-5" :class="[`is-${carrier.color}`, { 'Tag--secondary': carrier.id != formData.carrier }]" v-for="carrier in CARRIERS" :key="carrier.id" @click="formData.tracker.carrier = carrier.id">
                                    {{ carrier.label }}
                                </div>
                            </div>

                            <div class="mt-10">
                                <toggle-base v-model="formData.bcc" label="Recevoir une copie de l'avis sur mon mail" />
                            </div>
                        </div>
                        <div class="width-xs">
                            <scanner-base v-model="formData.tracker.trackingCode" />
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { InputBase, ToggleBase } from 'instant-coffee-core'
const CARRIERS = [
    { id: 0, label: 'Courrier La Poste', color: 'duck' },
    { id: 1, label: 'Colissimo', color: 'sunset' },
    { id: 2, label: 'Chronopost', color: 'ice' },
]

export default {
    name: 'OrderBody',
    components: { InputBase, ToggleBase },
    props: {
        id: { type: String, default: '' }
    },
    data: () => ({
        CARRIERS,
        addNewTracking: false,
        formData: {
            tracker: {
                carrier: 0,
                trackingCode: null,
                bcc: false
            },
            prepared: []
        }
    }),
    computed: {
        order () { return this.$store.getters['shop-orders/findOne']({ _id: this.id }) },
        fullListings () {
            return this.order.listings.map(l => ({
                ...this.$store.getters['shop/listingById'](l.listingId),
                ...l
            }))
        }
    },
    watch: {
        order: {
            immediate: true,
            handler (v) {
                this.formData = {
                    ...this.formData,
                    prepared: v.prepared
                }
            }
        }
    },
    methods: {
        async toggleItem (id) {
            this.formData.prepared = this.isItemPrepared(id) ? this.formData.prepared.filter(i => i != id) : [ ...this.formData.prepared, id ]

            this.$store.dispatch('shop-orders/update', {
                _id: this.order._id,
                params: {
                    prepared: this.formData.prepared
                }
            })
        },
        isItemPrepared (id) {
            return this.formData.prepared.includes(id)
        },
        getCustomization (listing) {
            let variation = listing.variations ? listing.variations.find(v => v.valueId == null) : null

            return variation && variation.value != 'Non obligatoire pour cet article.' ? variation.value : null
        }
    }
}
</script>

<style lang="scss" scoped>

    .OrderListing {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid var(--color-border);

        &:last-child {
            border: none;
            margin: 0;
        }
    }

    .Order_tracking {
        min-height: 100%;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>