<template>
    <div class="GoPage">
        <div class="GoPage_container">
            <div class="text-center">
                <a href="https://arriere-boutique.fr">
                    <icon-base name="logo/logo-main" :height="55" class="fill-current" />
                </a>

                <p class="mv-20">Te transmettre mon expérience de manière simple et pragmatique pour que tu puisses te concentrer sur ce qui te fait vibrer : la création.</p>

                <div class="mv-5">
                    <button-base tag="a" icon-before="fire" :modifiers="['full', 'secondary', 'precious']" href="https://www.etsy.com/fr/ArriereBoutiqueFr/listing/1148993083">
                        LES TRAVAUX PRATIQUES : améliore ta boutique
                    </button-base>
                </div>

                <div class="mv-5">
                    <button-base tag="a" icon-before="book" href="https://arriere-boutique.fr/blog" :modifiers="['full', 'pond']">
                        Le blog de l'Arrière Boutique : guides, astuces
                    </button-base>
                </div>

                <div class="mv-5">
                    <button-base tag="a" icon-before="play" :modifiers="['full', 'gum']" href="https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg">
                        Améliore ta boutique avec mes vidéos sur Youtube
                    </button-base>
                </div>

                <div class="mv-5">
                    <button-base tag="a" icon-before="box-full" :modifiers="['full', 'precious']" href="https://arriereboutiquefr.etsy.com/">
                        Stickers personnalisés & cartes pour tes colis
                    </button-base>
                </div>
            </div>

            <hr class="Separator mv-30">

            <emailing-form type="s" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'GoPage',
    layout: 'blank',
    data: () => ({
        assets: { }
    }),
    head () {
        let meta = {}
        return meta
    }
}
</script>