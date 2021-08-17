<template>
    <div class="IconBase" v-html="svg" :class="{ 'IconBase--height': height !== undefined }" :style="[styles]">
    </div>
</template>

<script>
export default {
    name: 'IconBase',
    props: {
        name: { type: String, default: '' },
        width: { type: Number },
        height: { type: Number }
    },
    data: () => ({
        svg: ''
    }),
    created () {
        this.$data.svg = require(`@/assets/img/${this.$props.name}.svg.html`).default
    },
    computed: {
        styles () {
            let styles = {}
            if (this.$props.width) {
                styles = {
                    'width': this.$props.width + 'px',
                    '--width': this.$props.width + 'px'
                }
            }
            if (this.$props.height) {
                styles = {
                    ...styles,
                    'height': this.$props.height + 'px',
                    '--height': this.$props.height + 'px'
                }
            }
            return styles
        }
    }
}
</script>