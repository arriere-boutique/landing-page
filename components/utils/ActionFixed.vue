<template>
    <div class="ActionFixed" :class="{ 'is-active': isActive }">
        <div class="ActionFixed_float">
            <slot name="float"></slot>
        </div>

        <div class="ActionFixed_actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActionFixed',
    props: {
        isActive: { type: Boolean, default: false }
    }
}
</script>

<style lang="scss" scoped>
    .ActionFixed {
        position: sticky;
        z-index: 6;
        bottom: 0;
        transform: translateY(80px);
        transition: all 200ms ease;

        &.is-active {
            margin-top: 20px;
            transform: translateY(0);
        }
    }

    .ActionFixed_float {
        margin-bottom: 20px;
    }

    .ActionFixed_actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--color-bg-light);
        min-height: 80px;
        border-top: 1px solid var(--color-border);
        padding: 10px 0;
    }
</style>