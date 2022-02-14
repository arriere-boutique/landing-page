<template>
    <div>
        <div class="mb-30">
            <div>
                <slot></slot>
            </div>

            <nav-bar v-model="section" :items="items" ref="nav" />
        </div>

        <transition-group
            class="NavContent"
            tag="div"
            :name="`fade-${panAnimation}`"
            :class="{ 'is-reset': panReset }"
            :style="{ '--pos-x': `${pan}px` }"
            v-hammer:pan.horizontal="onPan"
            v-hammer:panend="onPanEnd"
            ref="container"
        >
            <component v-for="(sect) in items"
                :is="sect.component"
                v-bind="sect.props"
                :key="sect.id"
                v-show="section == sect.id || !section && sect.id == 'index'"
            />
        </transition-group>
    </div>
</template>

<script>
export default {
    props: {
        items: { type: Array },
        autoNav: { type: Boolean, default: false },
    },
    data: () => ({
        section: '',
        hammer: null,
        pan: 0,
        panReset: false,
        panAnimation: 'left'
    }),
    watch: {
        section (v) {
            if (this.$route.query.section !== v) {
                let query = { ...this.$route.query }

                if (v) {
                    query.section = v
                } else {
                    delete query.section
                }

                this.$router.push({ query })
            }
        },
        ['$route.query.section']: {
            immediate: true,
            handler (v) {
                this.section = v ? v : ''
            }
        },
        pan (v) {
            if (!v) {
                this.panReset = true
                setTimeout(() => {
                    this.panReset = false
                }, 150)
            }
        }
    },
    methods: {
        onPan (v) {
            let max = this.$refs.container.$el.offsetWidth
            let force = Math.max(1 - (Math.abs(v.deltaX * 0.1) / max), 0)

            this.pan += v.velocityX * force
        },
        onPanEnd (v) {
            this.pan = 0

            if (v.deltaX <= -100) {
                this.$refs.nav.next()
                this.panAnimation = 'right'
            } else if (v.deltaX >= 100) {
                this.$refs.nav.prev()
                this.panAnimation = 'left'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .NavContent {
        transform: translateX(var(--pos-x));
        touch-action: pan-y !important;

        &.is-reset {
            transition: all 150ms ease-out;
        }
    }
</style>