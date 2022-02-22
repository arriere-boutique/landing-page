<template>
    <popin-base :is-active="popin.active" :modifiers="['absolute-header', 's']" @close="onClose">
        <template slot="content">
            <div class="p-30 text-center">
                <p class="ft-l-medium mb-20" v-if="popin.data.title">{{ popin.data.title }}</p>
                <p>{{ popin.data.text }}</p>
            </div>
        </template>

        <template slot="footer">
            <div class="PopinBase_footerAction" :class="[ `is-${action.color}`, { 'is-disabled': action.count && action.count > count }]" v-for="(action, i) in popin.data.actions" :key="i" @click="() => action.$cancel ? onClose() : onAction(action)">
                <p>{{ action.count && action.count > count ? (action.count - count) : action.label }}</p>
            </div>
        </template>
    </popin-base>
</template>

<script>
export default {
    name: 'PopinManager',
    data: () => ({
        interval: null,
        count: 0,
    }),
    computed: {
        popin () { return this.$store.state.popin }
    },
    watch: {
        popin: {
            deep: true,
            handler (v) {
                if (v.active) {
                    this.count = 0
                    this.interval = setInterval(() => { this.count += 1 }, 1000)
                } else {
                    clearInterval(this.interval)
                }
            }
        }
    },
    methods: {
        onClose () {
            this.$store.commit('popin/close')
            setTimeout(() => this.$store.commit('popin/reset'), 300)
        },
        onAction (action) {
            if (action.action) action.action()

            this.onClose()
        }
    }
}
</script>