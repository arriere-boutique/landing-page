<template>
    <footer class="FooterBase">
        
        <div class="bg-gum-xweak">
            <div class="FooterBase_nav Wrapper Wrapper--m">
                <div class="FooterBase_links fx-grow row-xs">
                    <div class="col-6 pv-60 col-12@s pv-20@s" v-for="(item, i) in items" :key="i">
                        <p class="ft-m-bold">{{ item.label }}</p>

                        <div class="FooterBase_navLink" v-for="(link, j) in item.items" :key="j">
                            <nuxt-link class="link" :to="localePath(link.path)" v-if="link.path">
                                {{ link.label }}
                            </nuxt-link>
                            <a class="link" :href="link.href" target="_blank" v-else>
                                {{ link.label }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="FooterBase_brand">
                    <nuxt-link class="d-block" :to="localePath({ name: '/' })">
                        <icon-base name="logo/logo-main" class="fill-current" :height="65" />
                    </nuxt-link>

                    <div class="Title_secondary Title_secondary--s color-ft mv-40">
                        Le seul endroit où vos rêves sont impossibles, c'est dans votre tête
                        <p class="color-pond mt-20">R. Schuller</p>
                    </div>

                    <div class="d-flex fx-align-center fx-justify-center">
                        <a class="FooterBase_socials fill-pond" href="https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg" target="_blank">
                            <icon-base name="brands/youtube" :width="22" />
                        </a>

                        <a class="FooterBase_socials fill-pond"  href="https://www.facebook.com/groups/etsy.en.france" target="_blank">
                            <icon-base name="brands/facebook" :width="20" />
                        </a>

                        <a class="FooterBase_socials fill-pond"  href="https://www.instagram.com/arriereboutiquefr" target="_blank">
                            <icon-base name="brands/instagram" :width="16" />
                        </a>

                        <a class="FooterBase_socials fill-pond"  href="https://www.etsy.com/fr/shop/ArriereBoutiqueFr" target="_blank">
                            <icon-base name="brands/etsy" :width="12" />
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
    props: {
        isShop: { type: Boolean, default: false }
    },
    data: () => ({
        items: [
            { label: `Apprenons ensemble !`, items: [
                { label: `Apprendre sur Youtube`, href: "https://www.youtube.com/channel/UCn1oYqWvUQvbE9DwlEVTgNg" },
                { label: `Me suivre sur Instagram`, href: "https://www.instagram.com/arriereboutiquefr" },
                { label: `Rejoindre notre groupe d'entraide`, href: "https://www.facebook.com/groups/etsy.en.france" },
                { label: `Se lancer sur Etsy`, href: "https://etsy.me/3vbM7TP" }
            ] },
            { label: "À propos", items: [
                { label: `Qui suis-je ?`, path: { name: 'moi-moi-moi' } },
                { label: `Fournitures pour vendeurs`, href: "https://arriereboutiquefr.etsy.com/" }
            ] }
        ]
    })
}
</script>