<template>
    <div class="NavBar">
        <div v-for="(item, i) in items" :key="i">
            <component
                :is="item.href || item.to ? 'link-base' : 'div'"
                :modifiers="['m']" 
                :tag="item.href ? 'a' : 'nuxt-link'"
                :href="item.href" :attrs="{ to: localePath(item.to) }" 
                class="NavBar_item"
                :class="{ 'is-active': value == item.id }"
                @click="() => item.onClick ? item.onClick() : $emit('input', item.id)"
            >
                {{ item.label }}
            </component>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    props: {
        value: { type: String },
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