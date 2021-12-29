<template>
    <div class="Breadcrumbs ft-m-medium">
        <div class="Breadcrumbs_item" v-for="(item, i) in items" :key="i">
            <p v-if="item.active">{{ item.label }}</p>
            <button-base :modifiers="['link', 'm']" tag="nuxt-link" :attrs="{ to: localePath(item.to) }" v-else>{{ item.label }}</button-base>
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
            color: var(--color-ft-weak);
            
            &::after {
                display: none;
            }
        }
    }
</style>