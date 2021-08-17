<template>
    <div class="ActionMenu" :class="{ 'is-active': state.open }">
        <button-base
            :modifiers="['round', 'xs', 'light']"
            class="mb-5"
            icon-before="ellipsis-v-alt"
            @click="state.open = !state.open"
            v-if="subItems.length > 0"
        />

        <button-base
            v-for="(item, j) in items"
            :modifiers="['round', 'xs', 'light']"
            class="mb-5"
            :icon-before="item.icon"
            :text="item.label"
            @click="item.onClick ? item.onClick() : () => {}"
            v-bind="item.attrs"
            :key="j"
        />

        <div class="ActionMenu_sub" v-if="subItems.length > 0">
            <button-base
                v-for="(sub, i) in subItems"
                :modifiers="['weak', 'xs', 'center']"
                :text="sub.label"
                v-bind="sub.attrs"
                :key="i"
                @click="sub.onClick ? sub.onClick() : () => {}"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActionMenu',
    props: {
        items: { type: Array, default: () => [] },
        subItems: { type: Array, default: () => [] }
    },
    data: () => ({
        listeners: {
            close: null
        },
        state: {
            open: false
        }
    }),
    watch: {
        ['state.open'] (v) {
            if (v && this.$data.listeners.close) {
                setTimeout(() => {
                    document.addEventListener('click', this.$data.listeners.close)
                }, 100)
            } else if (this.$data.listeners.close) {
                document.removeEventListener('click', this.$data.listeners.close)
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.$data.listeners.close)
    },
    mounted () {
        this.$data.listeners.close = (e) => {
            if (!this.$el.contains(e.target)) this.$data.state.open = false
        }
    }
}
</script>