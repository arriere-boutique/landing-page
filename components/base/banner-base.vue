<template>
    <div class="BannerBase">
        <div class="BannerBase_content">
            <slot></slot>
        </div>
        <div class="BannerBase_actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BannerBase'
}
</script>

<style lang="scss" scoped>
    .BannerBase {
        position: fixed;
        z-index: 15;
        min-height: 60px;
        padding: 10px;
        bottom: 0;
        width: 100%;
        color: var(--color-ft-light);
        font: var(--ft-s-medium);
        line-height: 1.2;
        background-color: var(--color-current);
        display: flex;
        align-items: center;
    }

    .BannerBase_actions {
        margin-left: 10px;
        display: flex;
        align-items: center;
    }

    .BannerBase_content {
        flex-grow: 1;
    }

    @include breakpoint-s {

        .BannerBase {
            bottom: 70px;
        }
    }
</style>