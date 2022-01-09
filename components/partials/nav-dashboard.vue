<template>
    <nav class="LayoutDashboard_nav">
        <div class="bg-pond-xweak m-20 p-20 br-m text-center">
            <icon-base name="logo/logo-main" class="fill-pond" :width="120" />

            <p class="ft-xs-medium mt-10 color-pond">v.0.2</p>
        </div>

        <div class="mt-20">
            <nuxt-link class="NavItem" v-for="link in links" :to="localePath(link.path)" :key="link.icon">
                <div class="fx-grow">
                    <i class="fal mr-5" :class="[`fa-${link.icon}`]"></i> {{ link.label }}
                </div>

                <i class="fal fa-arrow-right"></i>
            </nuxt-link>
        </div>
    </nav>
</template>

<script>
export default {
    class: 'NavDashboard',
    data: () => ({
        links: [
            { label: `Tableau de bord`, icon: 'book-heart', path: { name: 'dashboard' } },
            { label: `Mes commandes`, icon: 'receipt', path: { name: 'dashboard-commandes' } },
            { label: `Mes fiches produit`, icon: 'sparkles', path: { name: 'dashboard-fiches' } },
            { label: `Paramètres`, icon: 'cog', path: { name: 'dashboard-parametres' } }
        ]
    })
}
</script>

<style lang="scss" scoped>
    .NavItem {
        display: flex;
        align-items: center;
        font: var(--ft-m-medium);
        padding: 12px 25px 12px 20px;
        margin: 2px 0 2px 0;
        transition: all 150ms ease;

        i {
            transition: all 150ms ease;
        }

        &.is-active-exact {
            border-left: 4px solid var(--color-pond);
        }

        &:hover {
            background: var(--color-pond-xweak);

            & > i:last-child {
                transform: translateX(3px);
            }
        }
    }
</style>