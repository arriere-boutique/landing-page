<template>
    <div class="NavBar" :class="{ 'is-start': this.scroll <= 20, 'is-scroll': hasScroll }">
        <div class="NavBar_container" ref="container">
            <div v-for="(item, i) in items.filter(item => !item.disabled)" :key="i">
                <component
                    :id="`navbar-${item.id}`"
                    :is="item.href || item.to ? 'link-base' : 'div'"
                    :modifiers="['m']" 
                    :tag="item.href ? 'a' : 'nuxt-link'"
                    :href="item.href" :attrs="{ to: localePath(item.to) }" 
                    class="NavBar_item"
                    :class="{ 'is-done': item.checked, 'is-active': value == item.id }"
                    @click="() => onClick(item)"
                    :ref="item.id"
                >
                    <span class="round round-s bg-emerald-xweak color-emerald-xstrong mr-10" v-if="item.checked">
                        <i class="fal fa-check"></i>
                    </span>

                    {{ item.label }}
                </component>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    data: () => ({
        scroll: 0,
        hasScroll: false
    }),
    props: {
        value: { type: String },
        items: { type: Array, default: () => [] }
    },
    watch: {
        items: {
            immediate: true,
            handler (v) {
                if (this.availableItems[0] && this.availableItems[0].id != this.value) this.$emit('input', this.availableItems[0].id)
            }
        }
    },
    computed: {
        availableItems () {
            return this.items.filter(i => !i.disabled && !i.checked)
        },
        navigableItems () {
            return this.items.filter(i => !i.disabled)
        },
        currentIndex () {
            let i = 0
            
            this.navigableItems.forEach((item, index) => {
                if (item.id == this.value) i = index
            })

            return i
        }
    },
    mounted () {
        if (process.server) return

        this.hasScroll = this.$refs.container.scrollWidth > this.$refs.container.clientWidth

        if (this.hasScroll) {
            this.$nextTick(() => {
                let element = this.$refs[this.value][0]
                
                this.$refs.container.scrollTo({
                    left: element.offsetLeft - 40,
                    behavior: 'smooth'
                })
            })
        }

        this.$refs.container.addEventListener('scroll', () => {
            this.scroll = this.$refs.container.scrollLeft
        })
    },
    methods: {
        onClick (item) {
            let element = this.$refs[item.id][0]

            item.onClick ? item.onClick() : this.$emit('input', item.id)

            if (element) {
                this.$refs.container.scrollTo({
                    left: element.offsetLeft - 40,
                    behavior: 'smooth'
                })
            }
        },
        next () {
            if (this.navigableItems[this.currentIndex + 1]) this.$emit('input', this.navigableItems[this.currentIndex + 1].id)
        },
        prev () {
            if (this.navigableItems[this.currentIndex - 1]) this.$emit('input', this.navigableItems[this.currentIndex - 1].id)
        }
    }
}
</script>

<style lang="scss" scoped>
    .NavBar {
        border-bottom: 1px solid var(--color-border);
        position: relative;

        &.is-scroll {
            &::after,
            &::before {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                width: 33%;
                height: 100%;
                z-index: 2;
                pointer-events: none;
                transition: all 100ms ease;
            }

            &::after {
                right: -2px;
                background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%);
            }

            &::before {
                width: 10%;
                left: -2px;
                background: linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%);
            }

            .NavBar_container {

                &::after {
                    content: "";
                    display: block;
                    width: 75%;
                    height: 10px;
                    flex-shrink: 0;
                }
            }
        }

        &.is-start {

            &::before {
                opacity: 0;
            }
        }
    }

    .NavBar_container {
        display: flex;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
        }

    }

    .NavBar_item {
        height: 60px;
        display: flex;
        align-items: center;
        margin-right: 20px;
        font: var(--ft-m-medium);
        color: var(--color-ft-weak);
        cursor: pointer;
        position: relative;
        transition: all 100ms ease;

        &:hover {
            color: var(--color-ft);
        }

        &::before {
            content: "";
            display: block;
            position: absolute;
            bottom: 0px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--color-onyx);
            pointer-events: none;
            opacity: 0;
        }

        &.is-done {
            color: var(--color-ft-weak);

            &:hover {
                color: var(--color-ft);
            }

            &.is-active {
                color: var(--color-ft);
            }
        }

        &.is-active {
            color: var(--color-ft);
            pointer-events: none;

            &::before {
                opacity: 1;
            }
        }
    }
</style>