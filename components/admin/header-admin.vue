<template>
    <header class="HeaderAdmin">
        <div class="HeaderAdmin_left">
            <p class="ft-m-bold">{{ title }}</p>
        </div>
    </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'HeaderAdmin',
    computed: {
        user () { return this.$store.state.user.info },
        title () { return this.$store.state.page.meta.title },
    },
    data: () => ({
        listeners: {
            close: null
        },
        state: {
            profile: false
        }
    }),
    watch: {
        ['state.profile'] (v) {
            this.$store.commit('utils/toggleScroll', !v)

            if (v && this.$data.listeners.close) {
                setTimeout(() => {
                    document.addEventListener('click', this.$data.listeners.close)
                }, 100)
            } else if (this.$data.listeners.close) {
                document.removeEventListener('click', this.$data.listeners.close)
                this.$refs.form.reset()
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.$data.listeners.close)
    },
    mounted () {
        this.$data.listeners.close = (e) => {
            if (!this.$el.contains(e.target)) this.$data.state.profile = false
        }
    }
}
</script>