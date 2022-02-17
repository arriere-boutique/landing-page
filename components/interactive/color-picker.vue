<template>
    <div class="ColorPicker">
        <div class="ColorPicker_rows">
            <div class="ColorPicker_item" v-for="color in availableColors" :key="color.hex" :style="{ '--color': color.display ? color.display : color.hex }" :class="{ 'is-active': (color.display ? color.display : color.hex) == value }" @click="$emit('input', color.hex)">
                <i class="fal" :class="[`fa-${color.fa}`]" v-if="color.fa"></i>
            </div>
        </div>
    </div>
</template>

<script>
import COLORS from '@/static/colors'

export default {
    name: 'ColorPicker',
    props: {
        value: { type: String, default: '' },
        before: { type: Array, default: [] }
    },
    computed: {
        availableColors () {
            return [ ...this.before, ...COLORS ]
        }
    }
}
</script>

<style lang="scss" scoped>
    .ColorPicker_rows {
        display: flex;
        flex-wrap: wrap;
    }

    .ColorPicker_item {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1px;
        background-color: var(--color);
        cursor: pointer;
        transition: all 200ms ease;
        border: 1px solid var(--color-border);
        color: var(--color-ft-light);
        position: relative;

        & > i {
            opacity: 0.5;
        }

        &:hover {
            opacity: 0.5;
        }

        &.is-active {
            transform: scale(0.92);

            &::after {
                opacity: 1;
            }
        }

        &::after {
            content: "\f00c";
            font-family: "Font Awesome 6 Pro";
            display: flex;
            opacity: 0;
            align-items: center;
            justify-content: center;
            color: var(--color-ft);
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background-color: var(--color-bg-light);
            border-radius: 50%;
            font-size: 8px;
            pointer-events: none;
            transition: all 150ms ease-in-out;
        }
    }

</style>