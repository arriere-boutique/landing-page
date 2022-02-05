<template>
    <div
        class="ListingBlock"
        :class="[ $modifiers ]"
    >
        <div class="ListingBlock_cover">
            <div v-for="(image, i) in images.slice(1, 4)" :key="i" :style="{ backgroundImage: `url(${image.thumbnail})` }"></div>
        </div>

        <div class="ListingBlock_logo" :style="{ backgroundImage: `url(${images[0] ? images[0].thumbnail : ''})` }"></div>

        <div class="ListingBlock_content">
            <p class="ft-m-medium line-1 ellipsis-1">{{ title }}</p>

            <div class="mt-5">
                <span>
                    {{ quantity }} en stock
                </span>
            </div>
        </div>

        <div class="ListingBlock_footer">
            <div>
                <span @mouseenter="(e) => $tOpen(`${favorites} mises en favoris depuis sa création`, e)" @mouseleave="$tClose">
                    <i class="fal fa-heart mr-3"></i> {{ favorites }}
                </span>
            </div>
            <div>
                <span @mouseenter="(e) => $tOpen(`Profit estimé par vente de cet article`, e)" @mouseleave="$tClose">
                    <i class="fal fa-coin mr-3"></i> <span v-if="costs.totalRemaining">{{ costs.totalRemaining|round }}€</span>
                    <span class="round-s bg-sunset-xweak" v-else>?</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'ListingBlock',
    mixins: [ ModifiersMixin ],
    props: {
        title: { type: String },
        favorites: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        costs: { type: Object, default: () => ({}) },
        images: { type: Array, default: () => [] },
        modifiers: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
    .ListingBlock {
        border: 1px solid var(--color-border);
        border-radius: 15px;
        background: var(--color-bg-light);
        overflow: hidden;
        transition: all 150ms ease;
        cursor: pointer;
        box-shadow: 0 0 2px 0px var(--color-shadow);

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 3px 12px 0px var(--color-shadow);
        }
    }

    .ListingBlock_logo {
        margin: -40px auto 0;
        position: relative;
        z-index: 2;
        border: 4px solid var(--color-bg-light);
        background-color: var(--color-bg-weak);
        width: 80px;
        height: 80px;
        border-radius: 10px;
        background-size: cover;
    }

    .ListingBlock_cover {
        display: flex;
        background-color: var(--color-bg-weak);
        overflow: hidden;
        min-height: 75px;

        & > div {
            height: 75px;
            flex-grow: 1;
            background-size: cover;
            filter: blur(2px);
        }
    }

    .ListingBlock_content {
        text-align: center;
        padding: 10px 20px 20px 20px;
    }

    .ListingBlock_footer {
        display: flex;
        border-top: 1px solid var(--color-border);
        text-align: center;

        & > div {
            flex: 1 1 0px;
            padding: 10px;
            font: var(--ft-m-medium);
            border-right: 1px solid var(--color-border);

            &:last-child {
                border: none;
            }
        }
    }
</style>