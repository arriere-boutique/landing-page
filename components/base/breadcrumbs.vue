<template>
    <div class="Breadcrumbs ft-m-medium">
        <div class="Breadcrumbs_item" :class="{ 'is-active': item.active }" v-for="(item, i) in items" :key="i">
            <p v-if="item.active">{{ item.label }}</p>
            
            <link-base :modifiers="['m']" :tag="item.href ? 'a' : 'nuxt-link'" :href="item.href" :attrs="{ to: localePath(item.to) }" v-else>
                {{ item.label }}
            </link-base>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: {
        items: { type: Array, default: () => [] }
    }
}
</script>

<style lang="scss" scoped>
    .Breadcrumbs {
        display: flex;
        width: 100%;
    }

    .Breadcrumbs_item {

        &::after {
            content: ">";
            display: inline-block;
            margin: 0 10px;
        }

        &:last-child {
            
            &.is-active {
                color: var(--color-ft-weak);
            }
            
            &::after {
                display: none;
            }
        }
    }
</style>