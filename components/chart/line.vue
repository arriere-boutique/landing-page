<template>
    <div class="LineChart" :style="{ '--height': height + 'px' }">
        <div
            class="LineChart_line"
            v-for="(line, i) in lines"
            :style="{ '--percent': line.percent + '%', '--color': `var(${line.color ? line.color : getColor() })` }"
            :class="{ 'is-overflow': line.$overflow }"
            @mouseenter="(e) => $tOpen(line.label, e)"
            @mouseleave="$tClose"
            :key="i"
        >
            <span class="round-xs bg-pepper-xweak" v-if="line.$overflow"><i class="fal fa-triangle-exclamation"></i></span>
            <span v-else>{{ line.display }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LineChart',
    props: {
        total: { type: Number, default: 100 },
        height: { type: Number, default: 8 },
        values: { type: Array, default: () => [] }
    },
    data: () => ({
        colors: ['--color-gum', '--color-pond', '--color-duck', '--color-sunset', '--color-onyx', '--color-precious']
    }),
    computed: {
        computedTotal () {
            return this.values.reduce((total, current) => total + current.value, 0)
        },
        overflow () {
            return this.computedTotal > this.total
        },
        lines () {
            let values = this.values.sort((a, b) => a.value - b.value)

            if (this.overflow) {
                values.push({
                    color: '--color-pepper',
                    $overflow: true,
                    label: `Attention`,
                    value: this.computedTotal - this.total
                })
            }

            return values.map(v => {
                let percent = (v.value / this.total) * 100

                return {
                    ...v,
                    percent,
                    label: this.getLabel({ ...v, percent }),
                    display: this.getDisplay({ ...v, percent })
                }
            })
        }
    },
    methods: {
        getColor() {
            let selected = this.colors[this.$randomBetween(0, this.colors.length - 1)]
            this.colors = this.colors.filter(c => c != selected)
            return selected
        },
        getLabel (line) {
            let label = `${this.$round(line.percent, 2)}% (${this.$round(line.value, 2)}€) : ${line.label}`

            if (line.$overflow) label = line.label

            return label
        },
        getDisplay (line) {
            let display = this.$round(line.percent, 0) + '%'
            return display
        }
    }
}
</script>

<style lang="scss" scoped>
    .LineChart {
        position: relative;
        overflow: hidden;
        display: flex;

        &::before {
            content: "";
            height: var(--height);
            width: 100%;
            background: var(--color, var(--color-pond));
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 20px;
        }
    }

    .LineChart_line {
        width: var(--percent);
        font: var(--ft-s-medium);
        position: relative;
        z-index: 5;
        overflow: hidden;

        &:first-child {

            &::before {
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
            }
        }
        
        &:last-child {

            &::before {
                border-top-right-radius: 20px;
                border-bottom-right-radius: 20px;
            }
        }

        &::before {
            content: "";
            height: var(--height);
            margin-bottom: 5px;
            width: 100%;
            background: var(--color, var(--color-pond));
            display: block;
        }
    }

    .LineChart_line.is-overflow {
        text-align: right;
        overflow: visible;

        span {
            position: absolute;
            top: calc(var(--height) + 5px);
            right: 0;
        }
    }
</style>