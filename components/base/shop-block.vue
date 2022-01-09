<template>
    <div
        class="ShopBlock"
        :class="[ $modifiers ]"
    >
        <div class="ShopBlock_cover">
            <div v-for="listing in listings.slice(0, 3)" :key="listing._id" :style="{ backgroundImage: `url(${listing.images && listing.images[0] ? listing.images[0].thumbnail : ''})` }"></div>
        </div>

        <div class="ShopBlock_logo" :style="{ backgroundImage: `url(${logo})` }"></div>

        <div class="ShopBlock_content">
            <p class="ft-m-medium">{{ name }}</p>
            {{ listings.length }}
        </div>

        <div class="text-center">
            <button-base :modifiers="['s']" icon-before="arrows-rotate" @click="$emit('sync')">Synchroniser</button-base>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from '@instant-coffee/core'

export default {
    name: 'ShopBlock',
    mixins: [ ModifiersMixin ],
    props: {
        name: { type: String },
        logo: { type: String },
        listings: { type: Array },
        modifiers: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
    .ShopBlock {
        border: 1px solid var(--color-border);
        border-radius: 15px;
        background: var(--color-bg-light);
    }

    .ShopBlock_logo {
        margin: -40px auto 0;
        position: relative;
        z-index: 2;
        border: 4px solid var(--color-bg-light);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-size: cover;
    }

    .ShopBlock_cover {
        display: flex;

        & > div {
            height: 75px;
            flex-grow: 1;
            background-size: cover;
        }
    }

    .ShopBlock_content {
        text-align: center;
        padding: 20px;
    }
</style>