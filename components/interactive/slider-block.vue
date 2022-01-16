<template>
    <div class="SliderBlock" :style="{ '--step': step }">
        <div class="SliderBlock_rail">
            <div
                class="SliderBlock_item"
                v-for="slot in dynSlots"
                :class="[ itemClass, { 'is-active': slot == activeSlot } ]"
                :key="slot"
            >
                <slot :name="slot">
                    {{ slot }}
                </slot>
            </div>
        </div>

        <div class="SliderBlock_footer" v-if="!hideFooter">
            <div class="SliderBlock_bullets">
                <div class="SliderBlock_bullet" :class="{ 'is-active': slot == activeSlot }" v-for="slot in dynSlots" :key="slot"></div>
            </div>

            <slot name="submit"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SliderBlocks',
    props: {
        step: { type: Number, default: 0 },
        hideFooter: { type: Boolean, default: false },
        itemClass: { type: String, default: '' },
        isLoading: { type: Boolean, default: false }
    },
    computed: {
        dynSlots () {
            return Object.keys(this.$slots).filter(key => key != 'submit')
        },
        activeSlot () {
            return this.dynSlots[this.step]
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
        vertical-align: top;
        opacity: 0;
        pointer-events: none;
        transition: all 300ms ease;
        transform: scale(0.9);

        &.is-active {
            opacity: 1;
            pointer-events: all;
            transform: none;
        }
    }

    .SliderBlock_footer {
        display: flex;
        align-items: center;
        margin: 0 40px 40px;
        justify-content: space-between;
    }

    .SliderBlock_bullets {
        display: flex;
        align-items: center;
    }

    .SliderBlock_bullet {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--color-bg-weak);
        margin-right: 5px;

        &.is-active {
            background-color: var(--color-onyx);
        }
    }
</style>