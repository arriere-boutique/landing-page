<template>
    <div>
        <div class="bg-amber-2xweak pv-100">
            <div class="Wrapper d-flex">
                <div class="fx-grow pr-20">
                    <p class="Title_secondary color-amber-weak">Bienvenue dans</p>
                    <h1 class="ft-title-2xl">L'Arrière Boutique</h1>

                    <p class="max-width-m mt-5 ft-m">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis non eros sit amet ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit.
                    </p>
                </div>
                <div class="width-s fx-no-shrink">
                    <button-base class="mv-5" :modifiers="['display', 'amazonite']" icon-before="rocket" icon-after="long-arrow-right">
                        Guide de démarrage Etsy
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amber']" icon-before="play" icon-after="long-arrow-right">
                        Tout comprendre en vidéo
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amethyst']" icon-before="heart" icon-after="long-arrow-right">
                        Groupe d'entraide Facebook
                    </button-base>
                </div>
            </div>
        </div>

        <div class="bg-amethyst-2xweak pv-60">
            <div class="Wrapper Wrapper--l">
                <h2 class="ft-title-xl color-amethyst mb-20">Dernier article populaire</h2>

                <article-block
                    :modifiers="['l']"
                    title="Faut-il créer une ou plusieurs fiches produits ?"
                    excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis non eros sit amet ornare."
                    category="Etsy SEO"
                    image="https://images.pexels.com/photos/3975585/pexels-photo-3975585.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                />
            </div>
        </div>

        <div class="Wrapper pv-40">
            <article-block
                v-for="i in 3"
                class="mv-20"
                title="Faut-il créer une ou plusieurs fiches produits ?"
                excerpt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis non eros sit amet ornare."
                category="Etsy SEO"
                image="https://images.pexels.com/photos/3975585/pexels-photo-3975585.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                :key="i"
            />
        </div>
    </div>
</template>