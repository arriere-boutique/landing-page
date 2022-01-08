<template>
    <div class="AboutPage">
        <div class="Wrapper Wrapper--l d-flex fx-align-center d-block@s pb-30">
            <div class="max-width-s">
                <img class="width-100" :src="assets.blob1">
            </div>

            <div class="fx-grow pl-60 pl-0@s pt-20@s">
                <div class="max-width-l">
                    <p class="ft-2xl-bold">Un créatif, né juste au bon moment.<br><b class="color-accent">Salut, je m'appelle Théotime !</b></p>

                    <p class="mt-20 ft-m-medium">J'ai 26 ans. J'ai grandi avec un ordinateur dans les mains et ça a toujours été pour moi un outil créatif incroyable.<br><br>Touche-à-tout, amoureux des chiens et  un petit peu timide. <b>Et toujours des projets fous en tête !</b></p>
                </div>
            </div>
        </div>

        <div class="is-ice bg-bg-light pv-30">
            <div class="Wrapper Wrapper--l d-flex fx-align-center d-block@s">
                <div class="fx-grow pr-30 p-relative pr-0@s pb-20@s">
                    <div class="max-width-l">
                        <p class="ft-2xl-bold">
                            Difficile de trouver sa voie quand <br><b class="color-accent">on est intéressé par tout.</b>
                        </p>

                        <p class="mt-20 ft-m">
                            <b>J'ai beaucoup exploré.</b> Du développement de sites internet aux jeux-vidéos. De la vidéo à graphisme. Des réseaux sociaux au design de produits.
                            <br><br>
                            Sur mon temps libre, j'ai créé une association qui organise des rencontres pour les personnes qui peuvent se sentir isolées. 
                            <br><br>
                            J'ai la chance d'avoir obtenu un <b>Master Développeur créatif & designer</b> à la super école d'art <b>Les Gobelins</b>. J'ai ensuite travaillé plusieurs années dans une agence créative puis dans une start-up en plein essor. Plutôt confortable.
                            <br><br>
                            <b class="color-accent">Mais j'ai toujours eu l'impression qu'il me manquait quelque chose.</b>
                        </p>
                    </div>
                </div>

                <div class="max-width-m">
                    <img class="width-100" :src="assets.blob2">
                </div>
            </div>
        </div>

        <div class="is-ice bg-ice-xweak pv-60">
            <div class="Wrapper Wrapper--l d-flex d-block@s">
                <div class="max-width-s">
                    <img class="width-100" :src="assets.blob3">
                </div>

                <div class="fx-grow pl-30 pl-0@s pt-20@s">
                    <div class="max-width-l">
                        <p class="ft-2xl-bold">
                            Wooow, mais c'est génial Etsy !<br><b class="color-accent">Mes premières boutiques.</b>
                        </p>

                        <p class="mt-20 ft-m">
                            L'univers numérique me passionne, mais je veux de renouer avec le tangible. J'ai toujours été quelqu'un de manuel mais je n'avais jamais trop exploré cette partie de moi.
                            <br><br>
                            Je découvre Etsy par hasard. C'est une révélation. Quelques semaines plus tard, je lançais ma première boutique, sans trop savoir ce que je faisais. <b>Évidemment ça n'a pas fonctionné.</b>
                            <br><br>
                            <i>J'avais cette vision un peu naïve et me disait qu'il suffisait d'avoir de beaux produits pour vendre. Je me rends compte que le produit en lui-même importe peu au final.</i>
                        </p>

                        <h2 class="ft-xl-bold mb-20 mt-60">Mais au fil de mes expériences et de mes différentes boutiques, j'ai élaboré ma petite recette du succès</h2>

                        <p>
                            <b class="color-gum">Identité de marque :</b> avoir une véritable vision et savoir la transmettre à tes clients. 
                            <br><br>
                            <b class="color-precious">Valeur perçue :</b> la valeur réelle de ton produit importe peu. Si tu arrives à faire rêver à travers un écran, ta vente est assurée : peu importe le prix que tu demandes.
                            <br><br>
                            <b class="color-pond">Référencement :</b> se rendre visible sur les moteurs de recherche mais aussi grâce aux réseaux sociaux.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="is-gum bg-gum-xweak pv-30">
            <div class="Wrapper Wrapper--l d-flex fx-align-center d-block@s">
                <div class="fx-grow pl-0@s pb-20@s p-relative">
                    <div class="max-width-l">
                        <p class="ft-2xl-bold">
                            Construire quelque chose à soi, <br><b class="color-accent">mais pour les autres.</b>
                        </p>

                        <p class="mt-20 ft-m">
                            Je comprends rapidement que c'est ça qui me manquait. Je veux arrêter de donner mon énergie émotionnelle et créative pour les projets des autres. Je veux construire quelque chose, même à petite échelle.
                            <br><br>
                            Je décide de croire en moi et de me lancer en tant qu'entrepreneur. Je quitte mon travail salarié.
                            <br><br>
                            <b class="color-accent">Aujourd'hui, je veux partager avec toi ce que j'ai appris (et ce que j'apprends encore chaque jour). C'est une joie de rencontrer des personnes aussi douées pour les aider à faire reconnaître leur travail à sa juste valeur.</b>
                        </p>
                    </div>
                </div>

                <div class="max-width-m">
                    <img class="width-100" :src="assets.blob4">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import blob1 from '@/assets/img/blob/blob-me.jpg'
import blob2 from '@/assets/img/blob/blob-studapart.jpg'
import blob3 from '@/assets/img/blob/blob-papers.jpg'
import blob4 from '@/assets/img/blob/blob-ab.jpg'

export default {
    name: 'AboutPage',
    data: () => ({
        assets: { blob1, blob2, blob3, blob4 }
    }),
    head () {
        let meta = {
            title: `Salut ! Je m'appelle Théotime et j'ai créé l'Arrière Boutique.`,
            meta: [
                { hid: 'description', name: 'description', content: `Aujourd'hui, je veux partager avec toi ce que j'ai appris (et ce que j'apprends encore chaque jour). C'est une joie de rencontrer des personnes aussi douées pour les aider à faire reconnaître leur travail à sa juste valeur.` }
            ]
        }

        this.$store.commit('page/setColor', 'pond')
        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>