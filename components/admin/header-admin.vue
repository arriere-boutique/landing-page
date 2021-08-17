<template>
    <header class="HeaderAdmin">
        <div class="HeaderAdmin_left">
            <p class="ft-m-bold">{{ title }}</p>
        </div>

        <div class="HeaderAdmin_right">
            <nuxt-link to="/user/logout" v-if="user"></nuxt-link>

            <div class="HeaderAdmin_menu color-user" @click="state.profile = true">
                <i class="fal fa-bars"></i>
            </div>
        </div>

        <div class="HeaderAdmin_profile" :class="{ 'is-active': state.profile }">
            <div class="HeaderAdmin_profileBanner">
                <i class="HeaderAdmin_profileClose fal fa-times" @click="state.profile = false"></i>
            </div>

            <div class="HeaderAdmin_actions">
                <button-base
                    :modifiers="['light', 's', 'round']"
                    icon-before="cog"
                    tag="nuxt-link"
                    :attrs="{
                        to: this.localePath('/user')
                    }"
                />

                <div class="HeaderAdmin_picture">
                    <i class="fal" :class="[`fa-${user.theme.icon}`]"></i>
                </div>

                <button-base
                    :modifiers="['light', 's', 'round']"
                    icon-before="sign-out"
                    tag="nuxt-link"
                    :attrs="{
                        to: this.localePath('/user/logout')
                    }"
                />
            </div>

            <p class="mv-10 ft-m-bold color-user">{{ user.name }}</p>
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