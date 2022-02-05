<template>
    <nav class="NavAdmin" :class="[]">
        <nuxt-link to="/" class="NavAdmin_logo">
            <icon-base name="logo/logo-main" :height="50" />
        </nuxt-link>

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
            { label: 'Tableau de bord', icon: 'mug-tea', exact: true, link: 'admin' },
            { label: 'Blog', icon: 'newspaper', link: 'admin-articles' },
            { label: 'Catalogue', icon: 'shopping-cart', link: 'admin-catalogue' },
            { label: 'Utilisateurs', icon: 'scroll', link: 'admin-users' },
            { label: 'Bibliothèque de médias', icon: 'image', link: 'admin-other-medias' }
        ]
    })
}
</script>