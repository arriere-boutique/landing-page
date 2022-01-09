<template>
    <div
        class="ShopBlock"
        :class="[ $modifiers ]"
    >
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
    }
    .ShopBlock_logo {
        margin: 0 auto;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-size: cover;
    }

    .ShopBlock_content {
        text-align: center;
        padding: 20px;
    }
</style>