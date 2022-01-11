<template>
    <div>
        <div class="Wrapper Wrapper--left pb-40">
            <p class="ft-2xl-bold mv-40">Outils</p>

            <div class="Grid">
                <div class="Tile bg-pond-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-magnifying-glass"></i>
                        <p class="ft-xl-bold mv-5">Générateur de mots-clés</p>
                        <p class="ft-s-medium">Trouve des idées de mots-clés en quelques clics avec ce moteur de recherche.</p>
                    </div>

                    <div>
                        <button-base
                            tag="nuxt-link"
                            :modifiers="['pond', 'secondary']"
                            :attrs="{ to: localePath({ name: 'dashboard-outils-generateur-tags' }) }"
                        >
                            Trouver des mot-clés
                        </button-base>
                    </div>
                </div>

                <div class="Tile bg-emerald-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-chart-line-up"></i>
                        <p class="ft-xl-bold mv-5">Comparateur de prix moyen</p>
                        <p class="ft-s-medium">Découvre le prix moyen des articles vendus par la concurrence</p>
                    </div>

                    <div>
                        <button-base
                            tag="nuxt-link"
                            :modifiers="['emerald', 'secondary']"
                            :attrs="{ to: localePath({ name: 'dashboard-outils-generateur-tags' }) }"
                        >
                            Trouver le prix moyen
                        </button-base>
                    </div>
                </div>

                <div class="Tile bg-duck-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-chart-column"></i>
                        <p class="ft-xl-bold mv-5">Calcul de profit</p>
                        <p class="ft-s-medium">Découvre combien il te reste après avoir déduit tout tes coûts.</p>
                    </div>

                    <div>
                        <button-base
                            tag="nuxt-link"
                            :modifiers="['duck', 'secondary']"
                            :attrs="{ to: localePath({ name: 'dashboard-outils-generateur-tags' }) }"
                        >
                            Calculer mon profit
                        </button-base>
                    </div>
                </div>

                <div class="Tile bg-bg-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-image-landscape"></i>
                        <p class="ft-xl-bold mv-5">Générateur de bannière de boutique</p>
                        <p class="ft-s-medium">Sélectionne tes photos et crée ta bannière en quelques clics.</p>
                    </div>

                    <div>
                        <button-base
                            class="is-disabled"
                            :modifiers="['onyx', 'secondary']"
                        >
                            Bientôt
                        </button-base>
                    </div>
                </div>

                <div class="Tile bg-bg-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-gift-card"></i>
                        <p class="ft-xl-bold mv-5">Vendre des cartes cadeau</p>
                        <p class="ft-s-medium">Vends des cartes cadeaux pour ta boutique en quelques clics.</p>
                    </div>

                    <div>
                        <button-base
                            class="is-disabled"
                            :modifiers="['onyx', 'secondary']"
                        >
                            Bientôt
                        </button-base>
                    </div>
                </div>

                <div class="Tile bg-bg-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-trophy-star"></i>
                        <p class="ft-xl-bold mv-5">Organiser un jeu-concours</p>
                        <p class="ft-s-medium">Fais gagner des codes promo à tes clients avec un jeu interactif.</p>
                    </div>

                    <div>
                        <button-base
                            class="is-disabled"
                            :modifiers="['onyx', 'secondary']"
                        >
                            Bientôt
                        </button-base>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardTools',
    middleware: 'loggedUser',
    layout: 'dashboard',
    data: () => ({

    }),
    computed: {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>

</style>