<template>
    <nav class="NavAdmin" :class="[ `NavAdmin--${user.theme ? user.theme.color : 'amethyst'}` ]">
        <div class="NavAdmin_logo" :class="[`color-${user.theme ? user.theme.color: 'amethyst'}`]">

        </div>

        <div class="NavAdmin_items">
            <div class="NavAdmin_item" v-for="(item, i) in items" :key="i">
                <button-base
                    :class="{ 'is-disabled': item.disabled }"
                    :tag="item.link ? 'nuxt-link' : 'div'"
                    :modifiers="['weak' ]"
                    :attrs="{ to: localePath({ name: item.link }), exact: item.exact }"
                    :icon-before="item.icon"
                    :text="item.label"
                />

                <div class="NavAdmin_sub" v-if="item.items && item.items.length > 0">
                    <button-base
                        v-for="(sub, i) in item.items"
                        :modifiers="['weak', 's' ]"
                        :class="{ 'is-disabled': sub.disabled }"
                        tag="nuxt-link"
                        :text="sub.label"
                        :icon-before="sub.icon"
                        :attrs="{ to: localePath({ name: sub.link }) }"
                        :key="i"
                    />
                </div>
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