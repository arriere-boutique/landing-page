<template>
    <nav class="LayoutDashboard_nav" :class="{ 'is-active': isActive, 'is-mobile': isMobileNav, 'is-pond': !hasSub, 'is-precious': hasSub }">
        <div class="LayoutDashboard_hider" @click="isMobileNav = false"></div>

        <div class="LayoutDashboard_logo">
            <div class="LayoutDashboard_ab">
                <icon-base name="logo/logo-main" class="fill-current" :width="120" />
                <p class="ft-xs-medium mt-5">v.0.2</p>
            </div>
            <div class="LayoutDashboard_abCompact">
                <i class="fal fa-sparkles"></i>
            </div>
        </div>

        <div class="LayoutDashboard_links">
            <component
                :is="link.locked || link.dev ? 'div' : 'nuxt-link'"
                class="NavItem"
                :class="{ 'is-disabled': link.locked || link.dev, 'is-mobile': link.isMobile }"
                v-for="link in links"
                :to="localePath(link.path)"
                @click.native="$emit('toggle'); isMobileNav = false;"
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

            <div
                class="NavItem NavItem--burger is-mobile"
                @click="isMobileNav = !isMobileNav"
            >
                <div class="NavItem_icon">
                    <i class="fal fa-bars"></i>
                </div>
            </div>
        </div>

        <div class="LayoutDashboard_mobileMenu">
            <component
                :is="'nuxt-link'"
                class="NavItem"
                :class="{ 'is-disabled': link.locked || link.dev, 'is-mobile': link.isMobile }"
                v-for="link in links.filter(l => !l.isMobile && !l.dev)"
                :to="localePath(link.path)"
                @click.native="isMobileNav = false"
                :key="link.icon"
            >
                <div class="NavItem_icon">
                    <i class="fal" :class="[`fa-${link.icon}`]"></i>
                </div>

                <p class="NavItem_label ml-10 fx-grow">{{ link.label }}</p>
            </component>
        </div>

        <button-base
            class="LayoutDashboard_toggle"
            :icon-before="isCompact ? 'angle-right' : 'angle-left'"
            :modifiers="['round', 's', 'light']"
            @click="$store.commit('page/toggleCompact', { save: true })"
        />
    </nav>
</template>

<script>
export default {
    class: 'NavDashboard',
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        links: [],
        isMobileNav: false
    }),
    computed: {
        isCompact () { return this.$store.state.page.isNavCompact },
        shops () { return this.$store.state.shop.items },
        hasSub () { return this.$store.state.user.hasSubscription },
    },
    watch: {
        shops: {
            immediate: true,
            handler (v) {
                this.links = [
                    {
                        label: `Tableau de bord`,
                        icon: 'home-heart',
                        isMobile: true,
                        path: { name: '/' }
                    }, {
                        label: `Mes commandes`,
                        icon: 'receipt',
                        path: { name: 'commandes' },
                        isMobile: true,
                        tooltip: `Tu pourras bientôt gérer tes commandes ici. J'y travaille !`
                    }, {
                        label: `Mes fiches produit`,
                        icon: 'clipboard-list',
                        locked: !this.shops || this.shops.length <= 0,
                        dev: true,
                        tooltip: `Bientôt, tu pourras gérer des fiches produits en quelques clics.`,
                        isMobile: false,
                        path: { name: 'fiches' }
                    }, {
                        label: `Mes pages`,
                        icon: 'arrow-pointer',
                        locked: !this.shops || this.shops.length <= 0,
                        isMobile: true,
                        path: { name: 'pages' }    
                    }, {
                        label: `Outils`,
                        icon: 'rocket-launch',
                        isMobile: true,
                        path: { name: 'outils' }
                    }, {
                        label: `Paramètres`,
                        icon: 'cog',
                        isMobile: false,
                        path: { name: 'parametres' }
                    }
                ]
            }
        }
    },
    mounted () {
        if (this.$cookies.get('nav-compact')) this.$store.commit('page/toggleCompact', { force: this.$cookies.get('nav-compact') })
        if (!process.server && window.innerWidth <= 1000) this.$store.commit('page/toggleCompact', { force: false })
    }
}
</script>