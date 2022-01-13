<template>
    <div class="PageEditor Wrapper--left">
        <p class="ft-2xl-bold mv-40">{{ formData.title ? formData.title : 'Nouvelle page' }}</p>

        <div class="d-flex">
            <div class="PageEditor_preview fx-no-shrink">
                <div class="PageEditor_previewHeader">
                    <link-base :link="fullLink" target="_blank">{{ fullLink }}</link-base>
                </div>
                <landing-content class="PageEditor_content" :content="formData" />
            </div>
            <form class="fx-grow ml-30" @submit.prevent="update">
                <input-base label="Titre de la page" v-model="formData.title" :attrs="{ required: true }"></input-base>
                <textarea v-model="formData.description"></textarea>

                <div class="d-flex fx-align-center">
                    <select class="fx-no-shrink" v-model="formData.shop">
                        <option v-for="shop in shops" :value="shop._id" :key="shop.slug">
                            {{ shop.slug.toLowerCase() }}
                        </option>
                    </select>
                    <p class="fx-no-shrink mh-10">.arriere-boutique.fr/</p>
                    <input-base label="Slug" v-model="formData.slug" :attrs="{ required: true }"></input-base>
                </div>

                <div class="d-flex fx-align-center mv-10" v-for="(link, i) in formData.links" :key="i">
                    <input-base type="text" label="Texte du lien" v-model="link.label" />
                    <input-base type="text" class="ml-10" label="Lien" v-model="link.href" />

                    <div class="Buttons d-flex fx-no-shrink ml-10">
                        <div class="Button" @click="() => deleteLink(i)" v-if="formData.links.length > 1"><i class="fal fa-sm fa-trash-alt"></i></div>
                        <div class="Button ml-5" v-if="i == formData.links.length - 1" @click="addLink"><i class="fal fa-plus"></i></div>
                    </div>
                </div>

                <div class="bg-onyx">
                    <input type="range" min="0" max="100" :value="formData.customization['background-opacity']" @input="(e) => updateCustomization('background-opacity', e.target.value)">
                </div>

                <pexels-gallery @select="(v) => { updateCustomization('background', v.src.original); updateCustomization('background-thumbnail', v.src.large) }"/>

                <div class="mt-30 text-right">
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
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'DashboardPage',
    components: { InputBase },
    middleware: 'loggedUser',
    layout: 'dashboard',
    async fetch () {
        this.slug = this.$route.params.slug

        this.slug && this.slug != 'new' && !this.$route.query.clone ? await this.$store.dispatch('landings/get', { query: { slug: this.slug } }) : {}
    },
    data: () => ({
        slug: '',
        isLoading: true,
        prevFormData: {},
        formData: {
            title: '',
            description: '',
            slug: 'ma-page',
            customization: {},
            logo: '',
            links: [ { label: 'Mon lien', href: '' } ],
            shop: '',
        }
    }),
    computed: {
        serverEntity () { return this.$store.getters['landings/findOne']({ slug: this.$data.slug }, true) },
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

            if (this.formData.slug) link += '/' + this.formData.slug

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
        deleteLink (i) {
            this.formData.links.splice(i, 1)
        },
        addLink () {
            this.formData.links.push({ label: '', href: '' })
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

            if (response.status == 1) {
                this.$router.push({ path: this.localePath({ name: 'pages' }) })
            }
        },
        async update () {
            let response = await this.$store.dispatch('landings/create', {
                _id: this.formData._id && this.slug != 'new' ? this.formData._id : undefined,
                params: {
                    ...this.parseForm(this.formData),
                    owner: '$self'
                },
            })

            if (response.status == 1) {
                this.$router.push({ path: this.localePath({ name: 'pages-slug', params: { slug: response.data.slug } }) })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .PageEditor_preview {
        width: 450px;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .PageEditor_content {
        height: 600px;
        display: flex;
        flex-grow: 1;
    }

    .PageEditor_previewHeader {
        padding: 10px 15px;
    }

</style>