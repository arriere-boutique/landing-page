<template>
    <div class="block">
        <p class="ft-xl-bold"><i class="fal fa-crown color-duck mr-5"></i> Aller plus loin avec Canva Pro</p>
        <p class="ft-m">Je suis abonné à la formule pro et je ne regrette pas. D'ailleurs, tous mes posts sur Instagram sont réalisés sur Canva !<br><br>Grâce à la version Pro, tu as accès à beaucoup plus de photos, graphismes et vidéos. Et aussi un outil magique qui permet de retirer les fonds de tes photos : un vrai plus pour tes photos de fiches produits.</p>

        <p class="ft-l-medium">Canva t'offre 30 jours d'essai, sans engagement, <a href="https://partner.canva.com/c/2960525/689431/10068" target="_blank">en cliquant ici</a>.</p>

        <a href="https://partner.canva.com/c/2960525/689431/10068" target="_blank">
            <img :src="assets.canvaBrand">
        </a>
    </div>
</template>

<script>
import canvaBrand from '@/assets/img/partners/canva-brand.png'

export default {
    data: () => ({
        assets: { canvaBrand }
    })
}
</script>

<style lang="scss" scoped>
    .block {
        color: var(--color-ft-light);
        padding: 20px;
        border-radius: 6px;
        background: linear-gradient(156deg, var(--color-canva) 0%, var(--color-canva-blue) 80%, var(--color-canva-purple) 100%);

        img {
            display: block;
            width: 100%;
            border-radius: 4px;
        }
        
        p, p + p {
            margin: 0;
        }
    }
</style>