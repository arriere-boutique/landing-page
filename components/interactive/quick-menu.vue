<template>
    <div class="QuickMenu" :class="{ 'is-active': isActive }" ref="body">
        <div class="QuickMenu_button round-s" @click="isActive = !isActive">
            <i class="fal fa-ellipsis-stroke-vertical"></i>
        </div>
        
        <div class="QuickMenu_actions">
            <div class="QuickMenu_action" v-for="(item, i) in items" :key="i" @click="onClick(item)">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QuickMenu',
    props: {
        items: { type: Array, default: () => [] }
    },
    data: () => ({
        isActive: false,
        listeners: {
            close: null
        }
    }),
    watch: {
        isActive: {
            handler (v) {
                if (v && this.$data.listeners.close) {
                    setTimeout(() => {
                        document.addEventListener('click', this.$data.listeners.close)
                    }, 100)
                } else if (this.$data.listeners.close) {
                    document.removeEventListener('click', this.$data.listeners.close)
                }
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.$data.listeners.close)
    },
    mounted () {
        this.$data.listeners.close = (e) => {
            if (!this.$refs.body.contains(e.target)) this.isActive = false
        }
    },
    methods: {
        onClick (item) {
            this.isActive = false

            if (item.action) item.action() 
        }
    }
}
</script>

<style lang="scss" scoped>
    .QuickMenu {
        position: relative;
    }

    .QuickMenu_button {
        background-color: var(--color-bg-light);
        border: 1px solid var(--color-current-weak, var(--color-border));
        cursor: pointer;
    }

    .QuickMenu_actions {
        width: 200px;
        position: absolute;
        z-index: 10;
        bottom: -5px;
        right: 0;
        opacity: 0;
        pointer-events: none;
        transform: translateY(calc(100% - 5px));
        background-color: var(--color-bg-light);
        border: 1px solid var(--color-border);
        border-radius: 10px;
        box-shadow: 2px 2px 4px 0 var(--color-shadow);
        transition: all 100ms ease;
    }

    .QuickMenu_action {
        font: var(--ft-s-medium);
        padding: 3px 10px;
        display: flex;
        align-items: center;
        min-height: 40px;
        cursor: pointer;

        &:hover {
            background-color: var(--color-bg-xweak);
        }
    }

    .QuickMenu.is-active {

        .QuickMenu_actions {
            opacity: 1;
            transform: translateY(100%);
            pointer-events: all;
        }
    }
</style>