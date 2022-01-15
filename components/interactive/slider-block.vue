<template>
    <div class="SliderBlock" :style="{ '--step': step }">
        <div class="SliderBlock_rail">
            <div
                class="SliderBlock_item"
                v-for="slot in Object.keys($slots)"
                :class="{ 'is-active': slot == activeSlot }"
                :key="slot"
            >
                <slot :name="slot">
                    {{ slot }}
                </slot>
            </div>
        </div>

        <div>
            <p @click="step += 1">+</p>
            <p @click="step -= 1">-</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SliderBlocks',
    props: {
        initStep: { type: Number, default: 0 }
    },
    data: () => ({
        step: 0,
    }),
    computed: {
        activeSlot () {
            return Object.keys(this.$slots)[this.step]
        }  
    },
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
    .SliderBlock {
        overflow: hidden;
    }

    .SliderBlock_rail {
        white-space: nowrap;
        transition: all 300ms ease;
        transform: translateX(calc(-100% * var(--step)))
    }

    .SliderBlock_item {
        white-space: normal;
        width: 100%;
        display: inline-block;
        opacity: 0;
        pointer-events: none;
        transition: all 300ms ease;

        &.is-active {
            opacity: 1;
            pointer-events: all;
        }
    }
</style>