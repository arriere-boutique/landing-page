<template>
    <div class="NavBody">
        <div class="mb-30">
            <div>
                <slot></slot>
            </div>

            <nav-bar v-model="section" :items="items" ref="nav" />
        </div>

        <div
            class="NavContent"
            :class="{ 'is-reset': panReset }"
            :style="{ '--pos-x': `${pan}px` }"
            v-hammer:pan.horizontal="onPan"
            v-hammer:panend="onPanEnd"
            ref="container"
        >
            <transition :name="`fade-${panAnimation}`" mode="out-in">
                <component
                    :is="currentSection.component"
                    v-bind="currentSection.props"
                    :key="currentSection.id"
                />
            </transition>
        </div>
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
        currentIndex: 0,
        hammer: null,
        pan: 0,
        panReset: false,
        panAnimation: 'left'
    }),
    computed: {
        currentSection () {
            return this.items.find(i => (i.id == this.section || !this.section && i.id == 'index'))
        }
    },
    watch: {
        section (v) {
            if (this.$route.query.section !== v) {
                let query = { ...this.$route.query }
                let index = this.items.indexOf(this.currentSection)

                if (v) {
                    query.section = v
                } else {
                    delete query.section
                }

                this.panAnimation = this.currentIndex > index ? 'left' : 'right'

                this.$router.push({ query })
                this.currentIndex = index
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
            let max = this.$refs.container.offsetWidth
            let force = Math.max(1 - (Math.abs(v.deltaX * 0.1) / max), 0)

            this.pan += v.velocityX * force
        },
        onPanEnd (v) {
            this.pan = 0

            if (v.deltaX <= -100) {
                this.$refs.nav.next()
            } else if (v.deltaX >= 100) {
                this.$refs.nav.prev()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .NavContent {
        transform: translateX(var(--pos-x));
        touch-action: pan-y !important;
        transition: height 200ms ease-out;

        &.is-reset {
            transition: all 150ms ease-out;
        }
    }
</style>