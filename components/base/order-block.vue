<template>
    <div
        class="OrderBlock"
        :class="[ $modifiers ]"
    >
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
            <p class="ft-l-medium ellipsis-1">Pour {{ name }}</p>
            <p class="ft-s">Commandé le {{ $moment.unix(orderDate).format('DD MMM YYYY') }}</p>

            <div class="mt-10 d-flex ft-s-medium fx-wrap">
                <p class="mb-3 mr-15"><i class="fal fa-receipt mr-3"></i> {{ $round(total.amount / total.divisor) }}€ </p>
                <p class="mb-3 mr-15"><i class="fal fa-box-full mr-3"></i> {{ listings.length }} article(s)</p>
                <p class="mb-3 mr-15" v-if="expectedDate && status != 'Completed'"><i class="fal fa-box mr-3"></i> À envoyer avant le {{ $moment.unix(expectedDate).format('D MMM YYYY') }}</p>
                <p class="mb-3 mr-15" v-if="shippedDate && status == 'Completed'"><i class="fal fa-box-circle-check mr-3"></i> Envoyé le {{ $moment.unix(shippedDate).format('D MMM YYYY') }}</p>
            </div>
        </div>

        <!-- <div class="OrderBlock_right">
            <span class="round b bg-bg-light mv-3">
                <i class="fal fa-gift-card"></i>
            </span>
            <span class="round b bg-bg-light mv-3">
                <i class="fal fa-ellipsis-vertical"></i>
            </span>
        </div> -->
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
import { randomIcon } from '@/utils/base.js'

export default {
    name: 'OrderBlock',
    mixins: [ ModifiersMixin ],
    props: {
        shop: { type: Object, default: () => ({}) },
        status: { type: String, default: '' },
        name: { type: String },
        orderDate: { type: Number },
        expectedDate: { type: Number },
        shippedDate: { type: Number },
        total: { type: Object },
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
        cover () {
            return this.activeListings[0] && this.activeListings[0].images && this.activeListings[0].images[0].small ? this.activeListings[0].images[0].small : ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .OrderBlock {
        display: flex;
        border-radius: 15px;
        border: 1px solid var(--color-border);
        overflow: hidden;
        background-color: var(--color-bg-xweak);
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

    .OrderBlock_content {
        flex-grow: 1;
        padding: 15px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        background-color: var(--color-bg-light);
    }

    .OrderBlock_right {
        padding: 10px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>