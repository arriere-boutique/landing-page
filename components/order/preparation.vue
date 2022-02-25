<template>
    <div>
        <advice-block class="is-emerald mb-20" type="order-prep" :is-ignore="true" />

        <div class="Order_section p-20 b br-s">

            <div v-for="listing in fullListings" :key="listing.id">
                <div class="d-flex d-block@s" :class="[ isItemPrepared(listing.id) ? 'is-emerald' : 'is-onyx' ]">
                    <div>
                        <div class="d-flex fx-align-start">
                            <div class="image-block fx-no-shrink mr-15 br-s width-4xs width-5xs@s" :style="{ backgroundImage: `url(${listing.images ? listing.images[0].thumbnail : 0})` }"></div>

                            <div>
                                <p class="ft-medium ellipsis-1 ellipsis-break">
                                    {{ listing.title }}
                                </p>

                                <div class="d-flex fxa-center fx-justify-between mt-10 mt-5@s d-block@s">
                                    <div v-if="listing.variations">
                                        <div class="ft-s" v-for="variation in listing.variations.filter(l => l.valueId != null)" :key="variation.id">
                                            {{ variation.label }} :
                                            <b class="ft-medium">{{ variation.value }}</b>
                                        </div>
                                    </div>

                                    <p class="Tag ml-10 fx-no-shrink d-none@s" :class="[ listing.quantity > 1 ? 'is-gum' : 'Tag--weak' ]">Quantité : {{ listing.quantity }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-ice-xweak p-15 br-s mt-15" v-if="getCustomization(listing)">
                            <p class="ft-s-bold mb-5">Personnalisation</p>
                            <div v-html="getCustomization(listing)"></div>
                        </div>
                    </div>

                    <div class="p-10 fx-center text-center bg-current-xweak br-s ml-20 mt-10@s ml-0@s width-100@s">
                        <p class="Tag fx-no-shrink d-none d-flex@s" :class="[ listing.quantity > 1 ? 'is-gum' : 'Tag--weak' ]">Quantité : {{ listing.quantity }}</p>

                        <button-base class="is-emerald" :modifiers="isItemPrepared(listing.id) ? ['s', 'current'] : ['s', 'secondary', 'current-mute']" icon-before="check" @click="toggleItem(listing.id)">
                            Préparé
                        </button-base>
                    </div>
                </div>

                <hr class="Separator mv-20">
            </div>

            <div class="text-right">
                {{ this.$tc('base.articles', totalQuantity) }}
            </div>
        </div>

        <div class="Order_section is-sunset bg-current-xweak p-20 br-s" v-if="order.message">
            <p class="ft-l-bold mb-20">
                Message de l'acheteur
            </p>
            
            <div v-html="order.message"></div>
        </div>

        <div class="Order_section is-precious bg-current-xweak p-20 br-s" v-if="order.giftMessage">
            <p class="ft-l-bold mb-20">
                Message cadeau
            </p>
            
            <div v-html="order.giftMessage"></div>
        </div>
    </div>
</template>

<script>
import { InputBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'OrderPreparation',
    components: { InputBase, ToggleBase },
    props: {
        order: { type: Object }
    },
    data: () => ({
        formData: {
            prepared: []
        }
    }),
    computed: {
        fullListings () {
            return this.order.listings.map(l => ({
                ...this.$store.getters['shop/listingById'](l.listingId),
                ...l
            }))
        },
        totalQuantity () {
            return this.fullListings.reduce((t, l) => t += l.quantity, 0)
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