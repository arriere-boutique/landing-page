<template>
    <div
        class="OrderBlock"
        :class="[ $modifiers ]"
    >   
        <div class="Orderblock_main">
            <div class="d-flex fx-grow">
                <div class="OrderBlock_images">
                    <div class="OrderBlock_cover" :style="{ backgroundImage: `url(${ cover })` }">
                        <i class="fal color-ft-weak" :class="[ `fa-${randomIcon()}` ]" v-if="!cover"></i>
                    </div>

                    <div class="OrderBlock_others">
                        <div
                            class="OrderBlock_image"
                            v-for="(listing, i) in fullListings.slice(1, 4)"
                            :style="{ backgroundImage: `url(${ listing ? listing.images[0].thumbnail : '' })` }" :key="i"
                        >
                            <i class="fal color-ft-weak" :class="[ `fa-${randomIcon()}` ]" v-if="!listing"></i>
                        </div>
                    </div>
                </div>

                <div class="OrderBlock_content pl-20">
                    <div class="fx-center">
                        <p class="ft-l-medium fx-grow ellipsis-1 ellipsis-break">
                            {{ name }}
                        </p>

                        <div class="ft-s fx-no-shrink">
                            {{ $moment.unix(orderDate).format('DD MMM YYYY') }}
                        </div>
                    </div>

                    <div class="mt-10 d-flex ft-s-medium fx-wrap">
                        <div v-for="(tag, i) in tags" class="Tag Tag--s ml-0 mb-5 mr-5" :class="[`is-${tag.color}`]" :key="i">
                            <i class="fal mr-10" :class="[`fa-${tag.fa}`]"></i> {{ tag.label }}
                        </div>
                    </div>
                </div>
            </div>

            
            <div class="OrderBlock_shipments">
                <div class="OrderBlock_shipment OrderBlock_shipment--send" v-if="!shipments || shipments.length <= 0">
                    <div>
                        <span class="ft-s-medium">
                            À envoyer avant le {{ $moment.unix(expectedDate).format('D MMM YYYY') }}
                        </span>
                    </div>
                    
                    <div>
                        <span class="Tag Tag--s is-gum ml-3" :class="[timeLeft.days <= 1 ? 'is-pepper' : 'is-ice']">
                            {{ timeLeft.label }}
                        </span>

                        <span class="Tag Tag--s is-duck ml-3" v-if="shipUpgrade">
                            <i class="fal fa-bolt mr-10"></i> {{ shipUpgrade }}
                        </span>
                    </div>
                </div>
                <div class="OrderBlock_shipment" v-for="shipment in shipments" :key="shipment.shipment">
                    <div>
                        {{ shipment.carrier_name }}
                        <span class="Tag Tag--s ml-5 is-pond">{{ shipment.tracking_code ? shipment.tracking_code : `Pas de suivi` }}</span>
                    </div>

                    Envoyé le {{ $moment.unix(shipment.shipment_notification_timestamp).format('D MMM YYYY') }}
                </div>
            </div>
        </div>
                
        <div class="OrderBlock_right">
            <button-base :modifiers="['round', 'light']" class="mv-3" @click.native="$emit('action', 'add-tracking')">
                <i class="fal fa-gift-card"></i>
            </button-base>

            <button-base :modifiers="['round', 'light']" class="mv-3" @click.native="$emit('action', 'add-tracking')">
                <i class="fal fa-barcode-read"></i>
            </button-base>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
import { randomIcon } from '@/utils/base.js'

export default {
    name: 'OrderBlock',
    mixins: [ ModifiersMixin ],
    props: {
        status: { type: String, default: '' },
        name: { type: String },
        isGift: { type: Boolean, default: false },
        giftMessage: { type: String, default: '' },
        message: { type: String, default: '' },
        orderDate: { type: Number },
        expectedDate: { type: Number },
        shippedDate: { type: Number },
        shipUpgrade: { type: String },
        total: { type: Object },
        prepared: { type: Array, default: () => [] },
        shipments: { type: Array, default: () => [] },
        listings: { type: Array, default: () => [] }
    },
    data: () => ({
        randomIcon
    }),
    computed: {
        fullListings () {
            return this.listings.map(l => this.$store.getters['shop/listingById'](l.listingId))
        },
        activeListings () {
            return this.fullListings.filter(l => l)
        },
        totalQuantity () {
            return this.listings.reduce((t, c) => t += c.quantity, 0)
        },
        cover () {
            return this.activeListings[0] && this.activeListings[0].images && this.activeListings[0].images[0].small ? this.activeListings[0].images[0].small : ''
        },
        timeLeft () {
            let days = this.$moment.duration(this.$moment.unix(this.expectedDate).diff(this.$moment())).days()

            let label = days == 0 ? `Aujourd'hui` : (days < 0 ? `Il y a ${-days} jour(s)`: `Dans ${days} jour(s)`)

            return { days, label }
        },
        tags () {
            let tags = [
                { fa: 'box-full', color: 'onyx', label: `${this.totalQuantity} article(s)` },
                this.status != 'Completed' ? { fa: 'check', color: 'emerald', label: `${this.prepared.length}/${this.listings.length} préparé(s)` } : null,
                this.isGift || this.giftMessage ? { fa: 'gift', color: 'precious', label: this.giftMessage ? `Message cadeau` : `Marqué comme cadeau` } : null,
                this.message ? { fa: 'envelope-open-text', color: 'sunset', label: `Message de l'acheteur` } : null,
            ]

            return tags.filter(t => t)
        }
    }
}
</script>

<style lang="scss" scoped>
    .OrderBlock {
        border-radius: 15px;
        border: 1px solid var(--color-border);
        overflow: hidden;
        background-color: var(--color-bg-xweak);
        display: flex;
        cursor: pointer;
        transition: all 250ms ease;

        &:hover {
            transform: translateY(-2px);
        }
    }

    .Orderblock_main {
        flex-grow: 1;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        background-color: var(--color-bg-light);
    }

    .OrderBlock_cover {
        width: 110px;
        height: 110px;
        border-radius: 15px;
        background-size: cover;
        background-color: var(--color-bg-xweak);
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .OrderBlock_images {
        position: relative;
        padding: 15px 0 15px 15px;
        background-color: var(--color-bg-light);
    }

    .OrderBlock_others {
        position: absolute;
        bottom: 10px;
        right: -3px;
        display: flex;
    }

    .OrderBlock_image {
        flex-shrink: 0;
        width: 35px;
        height: 35px;
        border-radius: 8px;
        border: 2px solid var(--color-bg-light);
        background-size: cover;
        background-color: var(--color-bg-xweak);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        position: absolute;
        bottom: 0;
        right: 0;

        @for $i from 1 through 4 {
            &:nth-child(#{$i}) {
                right: #{($i - 1) * 25}px;
            }
        }
    }

    .OrderBlock_image--count {
        font: var(--ft-xs-medium);
        z-index: 2;
        border-radius: 50%;
    }

    .OrderBlock_content {
        flex-grow: 1;
        padding: 15px;
    }

    .OrderBlock_right {
        padding: 10px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .OrderBlock_shipments {
        padding: 0 10px 10px 10px;
    }

    .OrderBlock_shipment {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--color-current-xweak, var(--color-pond-xweak));
        background-color: var(--color-current-xweak, var(--color-pond-xweak));
        padding: 10px 15px;
        font: var(--ft-s-medium);
        border-radius: 10px;
        margin: 0 5px 5px 5px;
    }

    .OrderBlock_shipment--send {
        border-color: var(--color-border);
        background-color: var(--color-bg-light);
    }

    @include breakpoint-s {

        .OrderBlock_cover {
            width:  75px;
            height: 75px;
        }
    }
</style>