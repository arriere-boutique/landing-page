<template>
    <div class="PageEditor Wrapper--left pb-40">
        <div class="mv-40">
            <breadcrumbs :items="[
                { label: 'Pages', to: { name: 'pages' } },
                { label: formData.title ? formData.title : 'Nouvelle page', active: true },
            ]" />
            
            <p class="ft-3xl-bold mt-5">{{ formData.title ? formData.title : 'Nouvelle page' }}</p>
        </div>
        
        <div class="d-flex">
            <div class="PageEditor_previewContainer">
                <div class="PageEditor_preview fx-no-shrink">
                    <div class="PageEditor_previewHeader">
                        <link-base :link="fullLink" class="ellipsis-1" target="_blank">{{ fullLink }}</link-base>

                        <div class="copy" @click="() => $copy(fullLink)"><i class="fal fa-copy"></i></div>
                    </div>

                    <landing-content class="PageEditor_content" :is-preview="true" :content="parseForm(formData)" />
                </div>
            </div>

            <form class="fx-grow" @submit.prevent="update">
                <div class="br-m p-20 bg-gum-xweak">
                    <p class="ft-m-bold mb-20">Informations principales</p>

                    <input-base label="Titre de la page" v-model="formData.title" :attrs="{ required: true }" />
                    <textarea v-model="formData.description" class="mt-10" placeholder="Texte d'introduction"></textarea>
                </div>

                <div class="br-m p-20 bg-pond-xweak mv-10">
                    <p class="ft-s-bold mb-20">Liste de boutons</p>

                    <div class="d-flex fx-align-center mv-10" v-for="link in formData.links" :key="link.id">
                        <input-base type="text" label="Texte du lien" :value="link.label" :attrs="{ required: true }" @input="(v) => updateLink(link.id, { ...link, label: v })"/>
                        <input-base type="text" class="ml-10" label="Lien" :value="link.href" :attrs="{ required: true }" @input="(v) => updateLink(link.id, { ...link, href: v })"/>

                        <div class="Buttons d-flex fx-no-shrink ml-10">
                            <toggle-base :value="link.active" @input="(v) => updateLink(link.id, { ...link, active: v })" />

                            <div class="Button round bg-bg-light b ml-10" @click="() => deleteLink(link.id)" v-if="formData.links.length > 1"><i class="fal fa-sm fa-trash-alt"></i></div>
                        </div>
                    </div>

                    <div class="text-right mt-5">
                        <link-base fa="plus" @click.native.prevent="addLink">Ajouter un lien</link-base>
                    </div>
                </div>

                <div class="p-20 b br-m mv-10">
                    <p class="ft-m-bold mb-20">Personnalisation</p>
                    
                    <div class="mv-10">
                        <p class="ft-s-medium mb-10">Couleur de fond</p>
                        <color-picker
                            :before="[ { hex: 'auto', display: this.photoColor, fa: 'wand-magic-sparkles' } ]"
                            :value="formData.customization['background-color']"
                            @input="setColorPicker"
                            />
                    </div>

                    <div class="mv-10">
                        <p class="ft-s-medium mb-10">Transparence de l'image de fond</p>
                        <div class="d-flex">
                            <div class="bg-bg-xweak fx-grow br-m mr-20">
                                <input type="range" min="0" max="100" :value="formData.customization['background-opacity']" @input="(e) => updateCustomization('background-opacity', e.target.value)">
                            </div>

                            <p class="ft-m-medium">{{ formData.customization['background-opacity'] }}%</p>
                        </div>
                    </div>

                    <div class="mt-20">
                        <pexels-gallery @select="(v) => { setPhotoColor(v.avg_color); updateCustomization('background', { src: v.src.original, photographer: { url: v.photographer_url, name: v.photographer} }); updateCustomization('background-thumbnail', v.src.large) }"/>
                    </div>
                </div>

                <div class="p-20 b br-m mv-10" v-if="!formData.isHome">
                    <p class="ft-m-bold mb-10">Personnaliser mon lien</p>

                    <div class="d-flex fx-align-center">
                        <select-base
                            class="width-auto"
                            :options="shops.map(s => ({ id: s._id, label: s.slug.toLowerCase() }))"
                            v-model="formData.shop"
                        />
                        <p class="fx-no-shrink mh-10">.arriere-boutique.fr/</p>

                        <input-base v-model="formData.slug" style="min-width: 120px" :attrs="{ required: true }"/>
                    </div>

                    <p class="ft-xs-medium mt-10">Lien final : <span class="text-underline">{{ fullLink }}</span></p>
                </div>

                <div class="fixedSubmit text-right" :class="{ 'is-active': changesMade }">
                    <button-base
                        :modifiers="['gum']"
                        :class="{ 'is-disabled': !changesMade, 'is-loading': isLoading }"
                        type="submit"
                    >
                        Sauvegarder les changements
                    </button-base>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'DashboardPage',
    components: { InputBase, SelectBase, ToggleBase },
    middleware: 'loggedUser',
    layout: 'dashboard',
    async fetch () {
        this._id = this.$route.params.id

        this._id && this._id != 'new' && !this.$route.query.clone ? await this.$store.dispatch('landings/get', { query: { _id: this._id } }) : {}
    },
    data: () => ({
        _id: '',
        isLoading: true,
        photoColor: '',
        prevFormData: {},
        formData: {
            title: '',
            description: '',
            slug: 'ma-page',
            customization: {
                'background-opacity': 50,
                'background-color': '#000000'
            },
            logo: '',
            links: [ { id: Math.random(), label: 'Mon lien', href: '', active: true } ],
            shop: '',
        }
    }),
    computed: {
        serverEntity () { return this.$store.getters['landings/findOne']({ _id: this._id }, true) },
        shops () { return this.$store.state.shop.items },
        changesMade () {
            return JSON.stringify(this.parseForm(this.formData)) != JSON.stringify(this.parseForm(this.prevFormData))
        },
        currentShop () {
            return this.shops.find(s => s._id == this.formData.shop)
        },
        fullLink () {
            if (!this.currentShop) return ''

            let link = `https://${this.currentShop.slug}.${process.env.baseDomain}`

            if (this.formData.slug && !this.formData.isHome) link += '/' + this.formData.slug

            return link
        }
    },
    watch: {
        shops: {
            immediate: true,
            handler (v) {
                if (v && v[0] && !this.formData.shop) this.formData.shop = v[0]._id
            }
        },
        serverEntity: {
            immediate: true,
            deep: true,
            handler (v) {
                let form = this.decodeForm(v)

                this.formData = {
                    ...this.formData,
                    ...form
                }

                if (this.formData.links.length <= 0) this.formData.links = [ { label: '', href: '' } ]
                if (!this.formData.logo && this.currentShop) this.formData.logo = this.currentShop.logo

                this.prevFormData = { ...this.formData }
            }
        }
    },
    mounted () {
        this.formData = {
            ...this.decodeForm(this.formData),
            ...this.decodeForm(this.serverEntity)
        }

        this.isLoading = false
    },
    methods: {
        setColorPicker (value) {
            this.formData.customization = { ...this.formData.customization, ['background-color']: value == 'auto' ? this.photoColor : value }
        },
        setPhotoColor (value) {
            if (this.formData.customization['background-color'] == this.photoColor) this.setColorPicker(value)
            this.photoColor = value
        },
        addLink () {
            this.formData.links = [ ...this.formData.links, {
                id: Math.random(),
                label: '',
                href: '',
                active: true
            } ]
        },
        deleteLink (id) {
            this.formData.links = this.formData.links.filter(l => l.id != id)
        },
        updateLink (id, v) {
            this.formData.links = this.formData.links.map(l => l.id == id ? v : l)
        },
        updateCustomization (key, v) {
            this.formData.customization = { ...this.formData.customization, [key]: v }
        },
        decodeForm (form) {
            if (!form) return {}

            return {
                ...form
            }
        },
        parseForm (form) {
            return {
                ...form
            }
        },
        async deleteEntity () {
            let response = await this.$store.dispatch('landings/delete', this.$data._id)

            if (response) {
                this.$router.push({ path: this.localePath({ name: 'pages' }) })
            }
        },
        async update () {
            let response = await this.$store.dispatch('landings/create', {
                _id: this.formData._id ? this.formData._id : undefined,
                params: {
                    ...this.parseForm(this.formData),
                    link: this.fullLink,
                    shop: this.currentShop._id,
                    owner: '$self'
                },
            })

            if (response) {
                this.$router.push({ path: this.localePath({ name: 'pages-id', params: { id: response._id } }) })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .PageEditor_preview {
        width: 450px;
        height: 600px;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 30px;
        background-color: var(--color-bg-light);
    }

    .PageEditor_content {
        display: flex;
        flex-grow: 1;
    }

    .PageEditor_previewHeader {
        padding: 0 15px;
        display: flex;
        justify-content: space-between;

        .LinkBase {
            margin: 15px 0;
        }

        .copy {
            border-left: 1px solid var(--color-border);
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 0 0 0 15px;

            &:hover {
                color: var(--color-ft-weak);
            }
        }
    }

    .fixedSubmit {
        position: sticky;
        z-index: 6;
        border-top: 1px solid var(--color-border);
        padding: 20px 0;
        bottom: 0;
        background-color: var(--color-bg-light);
        transform: translateY(100%);
        transition: all 200ms ease;

        &.is-active {
            margin-top: 20px;
            transform: translateY(0);
        }
    }

    .Button {
        cursor: pointer;
        transition: all 150ms;

        &:hover {
            color: var(--color-ft-weak);
        }
    }
    .PageEditor_previewContainer {
        position: relative;
        margin-right: 30px;
    }

    @media screen and (max-width: 1200px) {
        
        .PageEditor_previewContainer {
            position: fixed;
            z-index: 5;
            bottom: 15px;
            left: 15px;
            transform-origin: left bottom;
            transform: scale(0.7);
        }
    }

</style>