<template>
    <div>
        <input-base label="Titre de la page" class="mv-10" v-model="formData.title">
            <tooltip text="Ce titre s'affichera dans les résultats Google." />
        </input-base>

        <div class="bg-precious-xweak p-20 br-s">
            <div class="fx-center mb-30">
                <p class="ft-m-medium color-precious-xstrong">
                    <i class="fal fa-stars"></i> Fonctionnalités avancées
                </p>

                <link-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'abonnements' }) }" v-if="!hasSub">
                    Soutenir le projet
                </link-base>
            </div>

            <p class="ft-s-medium color-precious-xstrong mb-20" v-if="!hasSub">
                Les contributeurs ont accès à ces fonctionnalités.
            </p>

            <input-base class="is-disabled mv-10" :value="formData.link" label="Mon lien">
                <link-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'parametres', query: { section: 'domains' } }) }">
                    Personnaliser
                </link-base>
            </input-base>

            <toggle-base class="mt-15" v-model="formData.hideBrand" :class="{ 'is-disabled': !hasSub }" label="Cacher le logo l'Arrière Boutique" />
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'LandingSettings',
    components: { InputBase, SelectBase, ToggleBase, },
    props: {
        formData: { type: Object }
    },
    data: () => ({

    }),
    computed: {
        hasSub () { return this.$store.state.user.hasSubscription },
    },
    methods: {

    }
}
</script>

<style>

</style>