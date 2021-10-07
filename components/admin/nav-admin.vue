<template>
    <nav class="NavAdmin" :class="[ `NavAdmin--${user.theme ? user.theme.color : 'amethyst'}` ]">
        <div class="NavAdmin_logo">
            L'Arrière Boutique
        </div>

        <div class="NavAdmin_items">
            <div class="NavAdmin_item" v-for="(item, i) in items" :key="i">
                <nuxt-link
                    class="NavAdmin_link"
                    :class="{ 'is-disabled': item.disabled }"
                    :to="localePath({ name: item.link })"
                    :exact="item.exact"
                >
                    <i class="fal mr-3" :class="[ `fa-${item.icon}` ]"></i> {{ item.label }}
                </nuxt-link>

                <!-- <div class="NavAdmin_sub" v-if="item.items && item.items.length > 0">
                    <nuxt-link
                        v-for="(sub, i) in item.items"
                        class="NavAdmin_link"
                        :class="{ 'is-disabled': sub.disabled }"
                        :attrs="{ to: localePath({ name: sub.link }) }"
                        :key="i"
                    >
                        {{ sub.label }}
                    </nuxt-link>
                </div> -->
            </div>
        </div>

        <div></div>
    </nav>
</template>

<script>

export default {
    name: 'NavAdmin',
    data: () => ({
        items: [
            { label: 'Tableau de bord', icon: 'mug-tea', exact: true, link: 'admin-dashboard' },
            { label: 'Articles', icon: 'newspaper', link: 'admin-articles' },
            { label: 'Pages', icon: 'file-alt', link: 'admin-pages' },
            { label: 'Gazette', icon: 'scroll', link: 'admin-newsletter' },
            { label: 'Bibliothèque de médias', icon: 'image', link: 'admin-other-medias' },
            { label: 'Mes paramètres', icon: 'user', link: 'admin-user' }
        ]
    }),
    computed: {
        user () { return this.$store.state.user.info },
        icon () { return this.user.theme ? this.user.theme.icon : 'cat-space' }
    }
}
</script>