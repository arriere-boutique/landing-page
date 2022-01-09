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
            <p class="ft-m-medium line-1">{{ name }}</p>
            <link-base :href="link" target="_blank">{{ link.replace('https://www.', '') }}</link-base>

            <div class="mt-20">
                <span class="mh-5" @mouseenter="(e) => $tOpen(`${listings.length} fiches produits synchronisées`, e)" @mouseleave="$tClose">
                    <i class="fal fa-memo"></i>  {{ listings.length }}
                </span>

                <span class="mh-5" @mouseenter="(e) => $tOpen(`${orders.length} commandes synchronisées`, e)" @mouseleave="$tClose"><i class="fal fa-receipt"></i> {{ orders.length }}</span>
            </div>
        </div>

        <div class="text-center mb-20">
            <button-base :modifiers="['secondary', 's']" :class="{ 'is-loading': isSyncing }" icon-before="arrows-rotate" @click="$emit('sync')" @mouseenter="(e) => $tOpen(`Synchronise si les informations de ta boutique te semblent incorrectes.`, e)" @mouseleave="$tClose">
                Synchroniser
            </button-base>
            <br>
            <link-base class="mt-10" @click="$emit('delete')">Déconnecter</link-base>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'ShopBlock',
    mixins: [ ModifiersMixin ],
    props: {
        name: { type: String },
        logo: { type: String },
        link: { type: String },
        listings: { type: Array, default: () => [] },
        orders: { type: Array, default: () => [] },
        modifiers: { type: Array, default: () => [] },
        isSyncing: { type: Boolean, default: false }
    }
}
</script>

<style lang="scss" scoped>
    .ShopBlock {
        border: 1px solid var(--color-border);
        border-radius: 15px;
        background: var(--color-bg-light);
        overflow: hidden;
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
        background-color: var(--color-bg-weak);

        & > div {
            height: 75px;
            flex-grow: 1;
            background-size: cover;
        }
    }

    .ShopBlock_content {
        text-align: center;
        padding: 10px 20px 20px 20px;
    }
</style>