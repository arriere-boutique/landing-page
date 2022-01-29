<template>
    <div>
        <div class="Wrapper pv-60">
            <p class="ft-3xl-bold mb-40">Outils gratuits</p>

            <p class="mb-20">Je mets ici à disposition des outils qui pourront te servir à gérer ta Boutique Etsy au mieux.</p>

            <div class="Grid">
                <div class="Tile bg-precious-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-magnifying-glass"></i>
                        <p class="ft-xl-bold mv-5">Trouver de nouveaux mots-clés</p>
                        <p class="ft-s-medium">Trouve des idées de mots-clés en quelques clics avec ce moteur de recherche.</p>
                    </div>

                    <div>
                        <button-base
                            tag="nuxt-link"
                            :modifiers="['precious', 'secondary']"
                            :attrs="{ to: localePath({ name: 'category-slug', params: { category: 'referencement-seo', slug: 'generateur-de-mot-cles-tags-etsy',  } }) }"
                        >
                            Trouver des mot-clés
                        </button-base>
                    </div>
                </div>
                
                <div class="Tile bg-duck-xweak cell-width-6 cell-height-2">
                    <div class="mb-20">
                        <i class="fal fa-chart-column"></i>
                        <p class="ft-xl-bold mv-5">Calculer mon profit</p>
                        <p class="ft-s-medium">Découvre combien il te reste après avoir déduit tout tes coûts.</p>
                    </div>

                    <div>
                        <button-base
                            tag="nuxt-link"
                            :modifiers="['duck', 'secondary']"
                            :attrs="{ to: localePath({ name: 'category-slug', params: { category: 'valeur-percue', slug: 'calculer-frais-etsy',  } }) }"
                        >
                            Calculer mon profit
                        </button-base>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlogTools',
    layout: 'blog'
}
</script>

<style lang="scss" scoped>

</style>