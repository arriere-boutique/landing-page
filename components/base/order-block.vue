<template>
    <div
        class="OrderBlock"
        :class="[ $modifiers, { 'is-completed': this.status == 'Completed' } ]"
    >   
        <div class="OrderBlock_main">
            <div class="OrderBlock_container">
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
                        <p class="ft-m-medium fx-grow ellipsis-1 ellipsis-break">
                            {{ name }}
                        </p>

                        <div class="OrderBlock_date ft-s fx-no-shrink ml-10">
                            {{ $moment.unix(orderDate).format('DD MMM YYYY') }}
                        </div>
                    </div>

                    <div class="OrderBlock_tags mt-10 d-flex ft-s-medium fx-wrap mt-5@s">
                        <div class="Tag Tag--s ml-0 mb-5 mr-5 is-duck" v-if="review"> 
                            <rating :rating="review.rating" />
                        </div>

                        <div v-for="(tag, i) in tags" class="Tag Tag--s ml-0 mb-5 mr-5" :class="[`is-${tag.color}`]" :key="i">
                            <i class="fal mr-10" :class="[`fa-${tag.fa}`]" v-if="tag.fa"></i> {{ tag.label }} <span class="round-xs ml-10 bg-bg-light" v-if="tag.count">{{ tag.count }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="OrderBlock_shipments" v-if="!isDigital && status != 'Completed'">
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
                <div class="OrderBlock_shipment is-emerald" v-for="shipment in shipments" :key="shipment.shipment">
                    <div class="fx-grow">
                        <span class="mr-10">{{ shipment.carrier_name }}</span>
                        <span class="Tag Tag--s is-emerald">{{ shipment.tracking_code ? shipment.tracking_code : `Pas de suivi` }}</span>
                    </div>

                    <p class="OrderBlock_shipmentDate">Envoyé le {{ $moment.unix(shipment.shipment_notification_timestamp).format('D MMM YYYY') }}</p>
                </div>
            </div>
        </div>
                
        <div class="OrderBlock_right">
            <button-base :modifiers="['round', 'light']" class="m-3" @click.native="$emit('action', 'add-tracking')">
                <i class="fal fa-gift-card"></i>
            </button-base>

            <button-base :modifiers="['round', 'light']" class="m-3" @click.native="$emit('action', 'add-tracking')">
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
        _id: { type: String },
        status: { type: String, default: '' },
        name: { type: String },
        isGift: { type: Boolean, default: false },
        giftMessage: { type: String, default: '' },
        message: { type: String, default: '' },
        orderDate: { type: Number },
        expectedDate: { type: Number },
        shippedDate: { type: Number },
        shipUpgrade: { type: String },
        userId: { type: String },
        total: { type: Object },
        review: { type: Object },
        prepared: { type: Array, default: () => [] },
        shipments: { type: Array, default: () => [] },
        listings: { type: Array, default: () => [] },
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

            let label = days == 0 ? `Aujourd'hui` : (days < 0 ? `Il y a ${this.$tc('base.days', -days)}`: `Dans ${this.$tc('base.days', days)}`)

            return { days, label }
        },
        otherOrders () {
            return this.$store.getters['shop-orders/find']({ userId: this.userId })
        },
        tags () {
            let tags = [
                { color: '', label: `${this.$tc('base.articles', this.totalQuantity)}` },
                this.status != 'Completed' ? { fa: 'check', color: 'emerald', label: this.prepared.length == this.listings.length ? 'Prête à envoyer' : `${this.prepared.length}/${this.$tc('order.prepared', this.listings.length)}` } : null,
                this.status != 'Completed' && (this.isGift || this.giftMessage) ? { fa: 'gift', color: 'precious', label: this.giftMessage ? `Message cadeau` : `Cadeau` } : null,
                this.otherOrders.length > 1 ? { fa: 'star', color: 'pond', label: `Client fidèle`, count: this.otherOrders.length } : null,
                this.status != 'Completed' && this.message ? { fa: 'envelope-open-text', color: 'sunset', label: `Message` } : null,
                this.isDigital ? { fa: 'arrow-down-to-line', color: 'precious', label: `Numérique` } : null,
            ]

            return tags.filter(t => t)
        },
        isDigital () {
            return this.listings.filter(c => c.digital).length == this.listings.length
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

    .OrderBlock_container {
        display: flex;
        flex-grow: 1;
    }

    .OrderBlock_main {
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

    .OrderBlock_shipmentDate


    .OrderBlock_shipment--send {
        border-color: var(--color-border);
        background-color: var(--color-bg-light);
    }

    .OrderBlock.is-completed {
        border-radius: 10px;
        background-color: var(--color-bg-light);
        
        .OrderBlock_right,
        .OrderBlock_shipmentDate,
        .OrderBlock_date {
            display: none;
        }

        .OrderBlock_container {
            align-items: center;
        }

        .OrderBlock_content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
        }

        .OrderBlock_images {
            padding: 10px 0 10px 10px;
        }
        
        .OrderBlock_cover {
            width:  40px;
            height: 40px;
            border-radius: 5px;
        }

        .OrderBlock_tags {
            flex-shrink: 0;
            max-width: 60%;
            justify-content: flex-end;
        }
    }

    @include breakpoint-s {
        .OrderBlock {
            display: block;
        }
        
        .OrderBlock_cover {
            width:  60px;
            height: 60px;
            border-radius: 5px;
        }

        .OrderBlock_others {
            display: none;
        }

        .OrderBlock_right {
            flex-direction: row;
        }
    }
</style>