<template>
    <header class="HeaderDashboard bg-bg-xweak">
        <div class="HeaderDashboard_wrapper">
            <div>
                <div class="HeaderDashboard_links">
                    <!-- <link-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'abonnements' }) }" class="HeaderDashboard_link mr-20">S'abonner</link-base> -->

                    <link-base tag="a" :link="$blogUrl" class="HeaderDashboard_link mr-20">Le blog</link-base>

                    <link-base tag="button" @click="isSupportOpen = true" class="HeaderDashboard_link">Un problème, une suggestion ?</link-base>
                </div>
            </div>

            <div class="HeaderDashboard_right">
                <!-- <div class="HeaderDashboard_profile"></div> -->
                <div class="HeaderDashboard_burger" @click="$emit('toggle')" v-show="!isActive">
                    <i class="fa-thin fa-bars"></i>
                </div>
            </div>
        </div>

        <div class="HeaderDashboard_close" @click="$emit('toggle')" v-show="isActive"> 
            <i class="fa-thin fa-times"></i>
        </div>

        <popin-base :modifiers="['absolute-header', 'm']" :is-active="isSupportOpen" @close="isSupportOpen = false">
            <div class="p-30" slot="content">
                Tes remarques, avis et suggestions sont toujours les bienvenus. N'hésite pas à m'en faire part ! <i class="fal fa-sparkles"></i>

                <a href="https://www.instagram.com/arriereboutiquefr/" class="d-block mt-20 p-20 is-gum bg-current-xweak br-s" target="_blank">
                    <div class="ft-s">Via Instagram</div>
                    <div class="ft-l-medium color-current-xstrong">@arriereboutiquefr</div>
                </a>

                <a href="mailto:theotime@arriere-boutique.fr" class="d-block mt-10 p-20 is-precious bg-current-xweak br-s">
                    <div class="ft-s">Par e-mail</div>
                    <div class="ft-l-medium color-current-xstrong">theotime@arriere-boutique.fr</div>
                </a>
            </div>
        </popin-base>
    </header>
</template>

<script>
export default {
    class: 'HeaderDashboard',
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        isSupportOpen: false
    })
}
</script>