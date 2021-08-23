<template>
    <footer class="FooterBase">
        <!-- <div class="bg-amber-2xweak pv-60">
            <div class="Wrapper Wrapper--l">

                <div class="d-flex">
                    <p class="ft-title-xl-bold width-xs fx-no-shrink">5000€ / mois sans rien faire ?</p>
                    <div class="ft-l">
                        <p>
                            <b>Soyons sérieux !</b> Développer une marque et commencer à vivre de ses créations prend du temps et beaucoup d'efforts. Je n'ai aucun intérêt à te vendre du rêve. Mais je suis là pour t'aider à faire rêver à tes clients grâce à tes créations originales.
                        </p>

                        <button-base class="mt-20" :modifiers="['amber']">Découvrir l'Arrière Boutique</button-base>
                    </div>
                </div>
            </div>
        </div> -->

        <div class="bg-onyx-2xweak">
            <div class="FooterBase_nav Wrapper Wrapper--l">
                <div class="FooterBase_links fx-grow row-xs">
                    <div class="col-4 pv-60 col-12@s pv-20@s" v-for="(item, i) in items" :key="i">
                        <p class="ft-m-bold">{{ item.label }}</p>

                        <div class="FooterBase_navLink" v-for="(link, j) in item.items" :key="j">
                            <nuxt-link class="link" :to="link.path" v-if="link.path">
                                {{ link.label }}
                            </nuxt-link>
                            <a class="link" :href="link.href" target="_blank" v-else>
                                {{ link.label }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="FooterBase_brand">
                    <div class="d-block fill-amber">
                        <nuxt-link :to="localePath({ name: '/' })">
                            <icon-base name="logo/logo-main" :width="100" />
                        </nuxt-link>
                    </div>


                    <div class="Title_secondary Title_secondary--s color-ft mv-40">Le seul endroit où vos rêves sont impossibles, c'est dans votre tête</div>

                    <div>
                        <a class="FooterBase_socials fill-amber" href="https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg" target="_blank">
                            <icon-base name="brands/youtube" :width="22" />
                        </a>

                        <a class="FooterBase_socials fill-amber"  href="https://www.facebook.com/groups/etsy.en.france" target="_blank">
                            <icon-base name="brands/facebook" :width="20" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'FooterBase',
    data: () => ({
        items: [
            { label: `Nous rejoindre`, items: [
                { label: `Chaîne Youtube`, href: "https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg" },
                { label: `Groupe d'entraide`, href: "https://www.facebook.com/groups/etsy.en.france" },
            ] },
            { label: "À propos", items: [

            ] },
            { label: "Liens importants", items: [
                
            ] }
        ]
    })
}
</script>