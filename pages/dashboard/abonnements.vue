<template>
    <div class="Wrapper Wrapper--left pv-40">
        <div class="max-width-l">
            <h1 class="ft-3xl-bold max-width-l">Bienvenue dans l'accès anticipé de l'Arrière Boutique !</h1>

            <p class="mt-20">Ici Théotime, le créateur et développeur du projet ! Je gère également des boutiques Etsy et je sais à quel point tu peux te sentir limité·e par les fonctions de la plateforme.<br><br><b>C'est pourquoi j'ai à coeur de te fournir les meilleurs outils possible pour t'accompagner dans ta réussite</b>. J'ai créé l'Arrière Boutique avec trois objectifs en tête.</p>

            <ol class="bg-precious-xweak br-m p-20 pl-40 mv-20 ft-m-medium">
                <li>Te faire gagner du temps, en toute simplicité.</li>
                <li>T'aider à prendre les meilleures décisions et à optimiser ta boutique.</li>
                <li>Faire que tenir ta boutique Etsy reste un plaisir.</li>
            </ol>

            <p>Le développement est bien entamé et chaque jour, de nouvelles fonctionnalités voient le jour. Mais c'est un projet ambitieux dont la réalisation prendra quelques mois supplémentaires.</p>

            <p class="mt-20">C'est pourquoi les fonctionnalités premium sont désormais disponibles au <b>Tarif Early-bird</b>. <b class="color-precious-strong">Pour un nombre limité de personnes, les abonnements sont réduits et leur prix est garanti à vie*</b>. En t'abonnant dès aujourd'hui, tu économises à long terme et tu soutiens un projet français.</p>
        </div>

        <subscriptions />

        <div class="ft-s">
            <p>* Prix garanti à vie. Pour toute souscription à un tarif préférentiel "Early-bird", tu gardes ce même prix pendant toute la durée de ton abonnement, même en cas d'ajout de nouvelles fonctionnalités. En cas d'arrêt de l'abonnement, le prix au tarif Early-bird est définitivement perdu, même en cas de ré-abonnement.</p>
            <p>** Prix définitif susceptible de changer. Il ne sera cependant jamais inférieur au prix Early-bird.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Abonnements',
    middleware: 'loggedUser',
    layout: 'dashboard',
}
</script>

<style lang="scss" scoped>

</style>