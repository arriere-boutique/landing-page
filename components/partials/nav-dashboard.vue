<template>
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
            <component
                :is="link.locked || link.dev ? 'div' : 'nuxt-link'"
                class="NavItem"
                :class="{ 'is-disabled': link.locked || link.dev }"
                v-for="link in links"
                :to="localePath(link.path)"
                :key="link.icon"
            >
                <div class="NavItem_icon">
                    <i class="fal" :class="[`fa-${link.icon}`]"></i>
                </div>

                <p class="NavItem_label mh-10 fx-grow">{{ link.label }}</p>

                <div class="NavItem_arrow" @mouseenter="(e) => link.tooltip || link.locked ? $tOpen(link.locked ? `Pour accéder à cette page, tu dois avoir au moins une boutique Etsy connectée.` : link.tooltip, e) : undefined" @mouseleave="$tClose">
                    <i class="fal fa-circle-question" v-if="link.dev"></i>
                    <i class="fal fa-lock" v-else-if="link.locked"></i>
                    <i class="fal fa-arrow-right" v-else></i>
                </div>
            </component>
        </div>

        <button-base
            class="LayoutDashboard_toggle"
            :icon-before="isCompact ? 'angle-right' : 'angle-left'"
            :modifiers="['round', 's', 'light']"
            @click="$store.commit('page/toggleCompact')"
        />
    </nav>
</template>

<script>
export default {
    class: 'NavDashboard',
    data: () => ({
        links: []
    }),
    computed: {
        isCompact () { return this.$store.state.page.isNavCompact },
        shops () { return this.$store.state.shop.items }
    },
    watch: {
        shops: {
            immediate: true,
            handler (v) {
                this.links = [
                    {
                        label: `Tableau de bord`,
                        icon: 'book-heart',
                        path: { name: '/' }
                    }, {
                        label: `Mes commandes`,
                        dev: true,
                        icon: 'receipt',
                        path: { name: 'commandes' },
                        tooltip: `Tu pourras bientôt gérer tes commandes ici. J'y travaille !`
                    }, {
                        label: `Mes fiches produit`,
                        icon: 'clipboard-list',
                        locked: !this.shops || this.shops.length <= 0,
                        path: { name: 'fiches' }
                    }, {
                        label: `Mes pages`,
                        icon: 'arrow-pointer',
                        locked: !this.shops || this.shops.length <= 0,
                        path: { name: 'pages' }    
                    }, {
                        label: `Outils`,
                        icon: 'rocket-launch',
                        path: { name: 'outils' }
                    }, {
                        label: `Paramètres`,
                        icon: 'cog',
                        path: { name: 'parametres' }
                    }
                ]
            }
        }
    }
}
</script>