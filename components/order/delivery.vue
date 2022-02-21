<template>
    <div>
        <div class="Order_section is-ice bg-current-xweak p-20 br-s">
            <div class="fx-center">
                <p class="ft-l-bold">
                    Suivi de la commande
                </p>
            </div>
                
            <div class="row-s mt-20 fx-dir-column-reverse@s">
                <div class="col-6 col-12@s">
                    <div class="Order_tracking bg-ice-weak br-s">
                        <div class="width-100" v-if="order.shipments.length > 0">
                            <div class="fx-center pv-10 ph-15 bg-bg-light br-s mv-5" v-for="shipment in order.shipments" :key="shipment.shipment">
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
                            <p class="ft-medium">À envoyer avant le {{ $moment.unix(order.expectedDate).format('D MMM YYYY') }}</p>

                            <span class="Tag Tag--s mt-10" :class="[timeLeft.days <= 1 ? 'is-pepper' : 'is-ice']">
                                {{ timeLeft.label }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-12@s mb-10@s">
                    <div class="bg-bg-light p-20 br-s d-flex fxa-start">
                        <div class="fx-grow">
                            <div class="ft-bold">{{ order.name }}</div>
                            <div>{{ order.adress1 }}</div>
                            <div v-if="order.adress2">{{ order.adress2 }}</div>
                            <div class="text-upper">{{ order.zip }} {{ order.city }}</div>
                            <div v-if="order.state">{{ order.state }}</div>
                            <div>{{ order.country }}</div>
                        </div>

                        <button-base
                            :modifiers="['round', 'light', 'xs']"
                            @click="$copy(formattedAddress)"
                            icon-before="copy"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="Order_section p-20 bg-bg-light b br-s" v-if="order.shipments.length <= 0 || isNewShipment">
            <div class="fx-center mb-20">
                <p class="ft-l-bold">
                    Envoi de la commande
                </p>
            </div>

            <div class="is-pepper ft-medium bg-pepper-xweak br-s p-15 mb-20" v-if="order.shipUpgrade">
                <span class="round color-pepper-xstrong bg-pepper-weak mr-10"><i class="fal fa-bolt"></i></span> Surclassement de livraison en <span class="Tag ml-5">{{ order.shipUpgrade }}</span>
            </div>
            
            <div class="d-flex fx-dir-column-reverse@s">
                <div class="fx-grow mr-30 mr-0@s">
                    <div class="mb-10">
                        <div class="Tag mr-5 mb-5" :class="[`is-${carrier.color}`, { 'Tag--secondary': carrier.id != formData.tracker.carrier }]" v-for="carrier in CARRIERS" :key="carrier.id" @click="formData.tracker.carrier = carrier.id">
                            {{ carrier.label }}
                        </div>
                    </div>

                    <input-base label="Nom du transporteur" class="mv-10" v-model="formData.tracker.customCarrier" v-if="formData.tracker.carrier == 999" />

                    <input-base label="Code de suivi" class="mv-10" v-model="formData.tracker.trackingCode" v-if="formData.tracker.carrier != 9999" />

                    <div class="mt-10">
                        <toggle-base v-model="formData.tracker.bcc" label="Recevoir une copie de l'avis sur mon mail" />
                    </div>
                </div>
                <div class="width-xs width-100@s mb-20@s">
                    <scanner-base v-model="formData.tracker.trackingCode" />
                </div>
            </div>

            <div class="text-right mt-20">
                <button-base @click="onSend" :modifiers="['ice']" icon-before="paper-plane" :class="{ 'is-loading': isLoading }">
                    Confirmer l'envoi
                </button-base>
            </div>
        </div>
        <div class="Order_section text-center" v-else>
            <link-base @click.native="isNewShipment = true" icon-before="plus">Ajouter un nouveau suivi</link-base>
        </div>
    </div>
</template>

<script>
import { InputBase, ToggleBase } from 'instant-coffee-core'
const CARRIERS = [
    { id: 0, label: 'La Poste', color: 'duck' },
    { id: 1, label: 'Colissimo', color: 'sunset' },
    { id: 2, label: 'Chronopost France', color: 'ice' },
    { id: 3, label: 'GLS', color: 'pond' },
    { id: 4, label: 'DPD', color: 'pepper' },
    { id: 5, label: 'Mondial Relay', color: 'gum' },
    { id: 999, label: 'Autre', color: 'onyx' },
    { id: 9999, label: 'Pas disponible', color: 'onyx' },
]

export default {
    name: 'OrderPreparation',
    components: { InputBase, ToggleBase },
    props: {
        order: { type: Object }
    },
    data: () => ({
        CARRIERS,
        isLoading: false,
        isNewShipment: false,
        formData: {
            tracker: {
                carrier: 0,
                customCarrier: '',
                trackingCode: null,
                bcc: false
            },
            prepared: []
        }
    }),
    computed: {
        formattedAddress () {
            let address = [this.order.name, this.order.adress1]

            if (this.order.adress2) address.push(this.order.adress2)
            address.push(this.order.zip + ' ' + this.order.city.toUpperCase())
            if (this.order.state) address.push(this.order.state)
            address.push(this.order.country)

            return address.join('\n')
        },
        timeLeft () {
            let days = this.$moment.duration(this.$moment.unix(this.order.expectedDate).diff(this.$moment())).days()

            let label = days == 0 ? `Aujourd'hui` : (days < 0 ? `Il y a ${this.$tc('base.days', -days)}`: `Dans ${this.$tc('base.days', days)}`)

            return { days, label }
        },
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
        async onSend () {
            this.isLoading = true

            try {

                await this.$store.dispatch('shop-orders/send', {
                    _id: this.order._id,
                    ...this.formData.tracker,
                    carrier: this.formData.tracker.carrier == 999 ? this.formData.tracker.customCarrier : CARRIERS.find(c => c.id == this.formData.tracker.carrier).label
                })
            } catch (e) {
                console.error(e)
            }
            
            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>

    .Order_tracking {
        min-height: 100%;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    @include breakpoint-s {
        .OrderListing {
            flex-wrap: wrap;
        }
    }
</style>