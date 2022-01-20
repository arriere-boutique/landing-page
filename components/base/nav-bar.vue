<template>
    <div class="NavBar">
        <div class="NavBar_item" :class="{ 'is-active': item.isActive }" v-for="(item, i) in items" :key="i">
            <link-base :modifiers="['m']" :tag="item.href ? 'a' : 'nuxt-link'" :href="item.href" :attrs="{ to: localePath(item.to) }" v-if="item.href || item.to">
                {{ item.label }}
            </link-base>
            <div @click="() => item.onClick ? item.onClick() : undefined" v-else>
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        items: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
    .NavBar {
        display: flex;
        border-bottom: 1px solid var(--color-border);
    }

    .NavBar_item {
        height: 60px;
        display: flex;
        align-items: center;
        margin-right: 20px;
        font: var(--ft-m-medium);
        cursor: pointer;
        position: relative;

        &::before {
            content: "";
            display: block;
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--color-onyx);
            pointer-events: none;
            opacity: 0;
        }

        &.is-active {
            pointer-events: none;

            &::before {
                opacity: 1;
            }
        }
    }
</style>