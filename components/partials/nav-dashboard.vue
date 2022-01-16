<template>
    <div class="LayoutDashboard_navContainer">
        <nav class="LayoutDashboard_nav">
            <div class="LayoutDashboard_logo">
                <div class="LayoutDashboard_ab">
                    <icon-base name="logo/logo-main" class="fill-pond" :width="120" />
                    <p class="ft-xs-medium mt-5">v.0.2</p>
                </div>
                <div class="LayoutDashboard_abCompact">
                    <i class="fal fa-sparkles"></i>
                </div>
            </div>

            <div class="LayoutDashboard_links mt-20">
                <nuxt-link class="NavItem" v-for="link in links" :to="localePath(link.path)" :key="link.icon">
                    <div class="NavItem_icon">
                        <i class="fal" :class="[`fa-${link.icon}`]"></i>
                    </div>

                    <p class="NavItem_label mh-10 fx-grow">{{ link.label }}</p>

                    <div class="NavItem_arrow">
                        <i class="fal fa-arrow-right"></i>
                    </div>
                </nuxt-link>
            </div>

            
        </nav>
        
        <button-base
            class="LayoutDashboard_toggle"
            :icon-before="isCompact ? 'angle-right' : 'angle-left'"
            :modifiers="['round', 's', 'light']"
            @mouseenter.native.stop
            @click="$store.commit('page/toggleCompact')"
        />
    </div>
</template>

<script>
export default {
    class: 'NavDashboard',
    data: () => ({
        links: [
            { label: `Tableau de bord`, icon: 'book-heart', path: { name: '/' } },
            { label: `Mes commandes`, icon: 'receipt', path: { name: 'commandes' } },
            { label: `Mes fiches produit`, icon: 'clipboard-list', path: { name: 'fiches' } },
            { label: `Mes pages`, icon: 'arrow-pointer', path: { name: 'pages' } },
            { label: `Outils`, icon: 'rocket-launch', path: { name: 'outils' } },
            { label: `Paramètres`, icon: 'cog', path: { name: 'parametres' } }
        ]
    }),
    computed: {
        isCompact () { return this.$store.state.page.isNavCompact }
    }
}
</script>