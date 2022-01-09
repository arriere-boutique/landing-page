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
            <p class="ft-m-medium">Pour {{ name }}</p>

            <div v-for="listing in listings.slice(0, 3)" class="d-flex fx-align-center" :key="listing._id">
                <p class="">{{ listing.title.slice(0, 20) }}...</p>

                <div class="Separator fx-grow mh-10"></div>

                <p class="ellipsis-1 fx-no-shrink">x {{ listing.quantity }}</p>
            </div>

            <div class="text-right ft-m-medium" v-if="listings.length > 3">
                + {{ listings.length - 3 }} autres
            </div>
        </div>

        <div class="OrderBlock_price ml-20">
            {{ $moment().diff($moment.unix(orderDate), 'days') }}
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
        shop: { type: Object, default: () => ({}) },
        name: { type: String },
        orderDate: { type: Number },
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
        padding: 10px;
        border-radius: 10px;
        border: 1px solid var(--color-border);
    }
    .OrderBlock_cover {
        width: 120px;
        height: 120px;
        border-radius: 10px;
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
    }

    .OrderBlock_others {
        position: absolute;
        bottom: -4px;
        right: -4px;
        display: flex;
    }

    .OrderBlock_image {
        flex-shrink: 0;
        width: 35px;
        height: 35px;
        border-radius: 5px;
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
                right: #{($i - 1) * 20}px;
            }
        }
    }

    .OrderBlock_content {
        flex-grow: 1;
    }

    .OrderBlock_price {
        width: 40%;
        border-radius: 10px;
        background-color: var(--color-emerald-xweak);
    }
</style>