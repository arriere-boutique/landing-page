<template>
    <div class="Homepage">
        <div class="pv-100">
            <div class="Wrapper d-flex">
                <div class="fx-grow pr-20">
                    <p class="Title_secondary color-amber-weak">Bienvenue dans</p>
                    <h1 class="ft-title-2xl-bold">L'Arrière Boutique</h1>

                    <p class="max-width-m mt-5 ft-m">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis non eros sit amet ornare. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit.
                    </p>
                </div>
                <div class="width-s fx-no-shrink">
                    <button-base class="mv-5" :modifiers="['display', 'amazonite']" icon-before="rocket" icon-after="long-arrow-alt-right">
                        Guide de démarrage Etsy
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amber']" icon-before="play" icon-after="long-arrow-alt-right">
                        Tout comprendre en vidéo
                    </button-base>

                    <button-base class="mv-5" :modifiers="['display', 'amethyst']" icon-before="heart" icon-after="long-arrow-alt-right">
                        Groupe d'entraide Facebook
                    </button-base>
                </div>
            </div>
        </div>

        <div class="bg-amethyst-2xweak pv-60">
            <div class="Wrapper Wrapper--l">
                <h2 class="ft-title-xl-bold color-amethyst mb-20">Dernier article populaire</h2>

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
                v-for="page in pages"
                class="mv-20"
                :title="page.title"
                :excerpt="page.excerpt"
                category="Etsy SEO"
                image="https://images.pexels.com/photos/3975585/pexels-photo-3975585.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                
                :key="page.slug"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Homepage',
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: {}
        })
    },
    computed: {
        pages () { return this.$store.getters['articles/find']() },
    },
    head () {
        let meta = {
            title: 'Pages'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>