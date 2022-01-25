<template>
    <div class="Macaron">
        <div class="Macaron_bg" v-html="assets.macaron">
        </div>

        <div class="Macaron_svg" v-html="svg"></div>

        <div class="Macaron_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import macaron from '@/assets/img/label/macaron.svg.html'

export default {
    name: 'Macaron',
    props: {
        name: { type: String, default: '' },
    },
    data: () => ({
        assets: { macaron },
        svg: ''
    }),
    created () {
        this.$data.svg = require(`@/assets/img/${this.$props.name}.svg.html`).default
    }, 
}
</script>

<style lang="scss">
    .Macaron {
        position: relative;
        width: 110px;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .Macaron_svg {
        animation: spin 16s linear 0s infinite;
        position: absolute;
        width: 80px;
        height: 80px;
        top: calc(50% - 40px);
        left: calc(50% - 40px);
    }

    .Macaron_bg {
        position: absolute;
        top: 0;
    }

    .Macaron_content {
        position: relative;
        z-index: 3;
    }

    .Macaron_svg svg,
    .Macaron_bg svg {
        width: 100%;
    }

    .Macaron_bg path {
        fill: var(--color-current-weak, var(--color-bg-light));
        fill: var(--color-bg-light);
    }

    .Macaron_svg path {
        fill: var(--color-current-xstrong, var(--color-ft));
    }

</style>