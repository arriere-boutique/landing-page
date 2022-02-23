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

        <div class="LayoutDashboard_links fx-grow">
            <component
                :is="link.locked || link.dev ? 'div' : 'nuxt-link'"
                class="NavItem"
                :class="{ 'is-disabled': link.locked || link.dev, 'is-mobile': link.isMobile }"
                v-for="link in displayLinks.slice(0, $smallerThan('s') ? 4 : 9999)"
                :to="localePath(link.path)"
                @click.native="$emit('toggle'); isMobileNav = false;"
                :key="link.icon"
            >
                <div class="NavItem_icon">
                    <i class="fal" :class="[`fa-${link.icon}`]"></i>
                    
                    <span class="notification" v-if="link.notification"></span>
                </div>

                <p class="NavItem_label mh-10 fx-grow">
                    {{ link.label }}

                    <span class="notification" v-if="link.notification"></span>
                </p>

                <div class="NavItem_arrow" @mouseenter="(e) => link.tooltip || link.locked ? $tOpen(link.locked ? `Pour accéder à cette page, tu dois avoir au moins une boutique Etsy connectée.` : link.tooltip, e) : undefined" @mouseleave="$tClose">
                    <i class="fal fa-circle-question" v-if="link.dev"></i>
                    <i class="fal fa-lock" v-else-if="link.locked"></i>
                    <i class="fal fa-arrow-right" v-else></i>
                </div>
            </component>

            <div
                class="NavItem NavItem--burger"
                @click="isMobileNav = !isMobileNav"
            >
                <div class="NavItem_icon">
                    <i class="fal fa-bars"></i>
                </div>
            </div>
        </div>

        <div class="LayoutDashboard_footer">
            <transition name="up">
                <div class="p-20 br-s bg-sunset-weak" v-show="!$route.name.includes('parametres') && shops.length == 0">
                    <p class="color-sunset-xstrong ft-m-medium">Fonctionnalités limitées</p>
                    <p class="ft-s mt-5 mb-10">Pour profiter de ton Arrière Boutique, connecte ta boutique Etsy en deux clics !</p>

                    <button-base
                        :modifiers="['xs', 'sunset']"
                        tag="nuxt-link"
                        icon-before="plus"
                        :attrs="{ to: localePath({ name: 'parametres' }) }"
                    >
                        Connecter ma boutique
                    </button-base>
                </div>
            </transition>
        </div>

        <div class="LayoutDashboard_mobileMenu">
            <component
                :is="'nuxt-link'"
                class="NavItem"
                :class="[ ...(link.classes ? link.classes : []), { 'is-disabled': link.locked || link.dev, 'is-mobile': link.isMobile } ]"
                v-for="link in displayLinks.slice(4, 999)"
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
        orders () { return this.$store.getters['shop-orders/find']({ status: 'Paid' }) },
        hasSub () { return this.$store.state.user.hasSubscription },
        displayLinks () {
            let links = this.links

            if (this.$smallerThan('s')) {
                links = links.map(l => ({ ...l, ...l.s }))
            }

            return links.filter(l => !l.disabled).sort((a, b) => a.order - b.order)
        }
    },
    watch: {
        shops: {
            immediate: true,
            handler (v) {
                this.links = [
                    {
                        label: `Tableau de bord`,
                        icon: 'home-heart',
                        path: { name: '/' },
                        s: {
                            order: 0
                        }
                    }, {
                        label: `Mes commandes`,
                        icon: 'receipt',
                        locked: !this.shops || this.shops.length <= 0,
                        notification: this.orders.length > 0,
                        path: { name: 'commandes' },
                        s: {
                            order: 3
                        }
                    }, {
                        label: `Mes fiches produit`,
                        icon: 'clipboard-list',
                        locked: !this.shops || this.shops.length <= 0,
                        dev: true,
                        tooltip: `Bientôt, tu pourras gérer des fiches produits en quelques clics.`,
                        path: { name: 'fiches' },
                        s: {
                            order: 2
                        }
                    }, {
                        label: `Mes pages`,
                        icon: 'arrow-pointer',
                        locked: !this.shops || this.shops.length <= 0,
                        path: { name: 'pages' } ,
                        s: {
                            order: 4
                        }   
                    }, {
                        label: `Débloquer toutes les options`,
                        icon: 'stars',
                        path: { name: 'abonnements' },
                        disabled: true,
                        s: {
                            classes: ['bg-precious-xweak', 'color-precious-strong'],
                            disabled: this.hasSub,
                            order: 5
                        }
                    }, {
                        label: `Outils`,
                        icon: 'rocket-launch',
                        path: { name: 'outils' },
                        s: {
                            order: 10
                        }
                    }, {
                        label: `Paramètres`,
                        icon: 'cog',
                        path: { name: 'parametres' },
                        s: {
                            order: 20
                        }
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