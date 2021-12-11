<template>
    <footer class="FooterBase">
        <!-- <div class="bg-skylight-xweak pv-30" v-if="!isShop">
            <div class="Wrapper">
                <div class="d-flex fx-align-center d-block@s">
                    <div class="p-relative fx-no-shrink mr-10 mb-20@s">
                        <p class="marker ft-hand-xl color-precious mt-40 n-ml-10 ml-20@s mt-30@s">Salut !</p>
                        <img :src="assets.blobHelp" width="200" />
                    </div>

                    <div class="ft-m ml-20">
                        <p class="ft-2xl-bold color-precious mb-10">Besoin d'un coup de main ?</p>

                        <p class="mb-20">
                            <b>Pas facile de s'y retrouver.</b> Développer une marque et commencer à vivre de ses créations prend du temps et beaucoup d'efforts. Mais je suis là pour t'aider à faire rêver tes clients grâce à tes créations originales. <b>Je propose des fournitures spécialement pour les vendeurs : stickers, goodies, cartes de visites...</b>
                        </p>

                        <button-base
                            :modifiers="['precious', 'icon-mango']"
                            iconBefore="sparkles"
                            tag="a"
                            target="_blank"
                            href="https://arriereboutiquefr.etsy.com/"
                            text="Je visite la boutique"
                        />
                    </div>
                </div>
            </div>
        </div> -->

        <div class="bg-bg-light pv-40 b-top">
            <div class="Wrapper Wrapper--s">
                <emailing-form />
            </div>
        </div>

        <div class="bg-gum-xweak">
            <div class="FooterBase_nav Wrapper Wrapper--l">
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
                        <icon-base name="logo/logo-main" class="fill-accent" :height="65" />
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