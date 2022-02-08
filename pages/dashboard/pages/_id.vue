<template>
    <div class="PageEditor Wrapper--left pb-100">
        <div class="d-flex fx-align-center mv-40">
            <breadcrumbs class="fx-no-shrink fx-shrink@s" :items="[
                { label: 'Pages', to: { name: 'pages' } },
                { label: fullLink ? fullLink : 'Ma page', href: fullLink ? fullLink : '' },
            ]" />
        </div>

        <div class="d-flex">
            <form id="mainForm" @submit.prevent="update"></form>

            <div class="fx-grow max-width-l" v-if="isInit">
                <nav-bar class="mb-40" :items="navItems" />

                <transition name="fade">
                    <div v-if="section == 'modules'">
                        <transition-group name="default" tag="div">
                            <component
                                v-for="module in orderedModules" :key="module.id" class="mb-10"
                                :is="module.type + '-edit'"
                                :modules="orderedModules"
                                :module="module"
                                @input="(v) => setModule(module.id, v)"
                                @delete="() => deleteModule(module.id)"
                            />
                        </transition-group> 

                        <div class="bg-bg-xweak d-flex fx-align-center fx-justify-center br-m p-20">
                            <link-base fa="plus" @click.native.prevent="isModuleLibraryActive = true">Ajouter un module</link-base>
                        </div>
                    </div>
                </transition>

                <transition name="fade">
                    <div v-if="section == 'style'">
                        <div class="p-20 b br-m mv-10">
                            <div class="mb-20">
                                <p class="ft-s-medium mb-10">Couleur de fond</p>
                                <color-picker
                                    :before="[ { hex: 'auto', display: this.photoColor, fa: 'wand-magic-sparkles' } ]"
                                    :value="formData.customization['background-color']"
                                    @input="setColorPicker"
                                />
                            </div>

                            <div class="mb-20">
                                <p class="ft-s-medium mb-10">Transparence de l'image de fond</p>
                                <div class="d-flex">
                                    <div class="bg-bg-xweak fx-grow br-m mr-20">
                                        <input type="range" min="0" max="100" :value="formData.customization['background-opacity']" @input="(e) => updateCustomization('background-opacity', e.target.value)" :attrs="{ form: 'mainForm' }">
                                    </div>

                                    <p class="ft-m-medium">{{ formData.customization['background-opacity'] }}%</p>
                                </div>
                            </div>

                            <pexels-gallery @select="(v) => { setPhotoColor(v.avg_color); updateCustomization('background', { src: v.src.original, photographer: { url: v.photographer_url, name: v.photographer} }); updateCustomization('background-thumbnail', v.src.large) }"/>
                        </div>
                    </div>
                </transition>
                
                <transition name="fade">
                    <div v-if="section == 'config'">
                        <input-base label="Titre de la page" v-model="formData.title">
                            <tooltip text="Ce titre s'affichera dans les résultats Google." />
                        </input-base>

                        <div class="p-20 b br-m mv-10" v-if="!formData.isHome">
                            <p class="ft-m-bold mb-10">Personnaliser mon lien</p>

                            <div class="d-flex fx-align-center">
                                <select-base
                                    class="width-auto"
                                    :options="shops.map(s => ({ id: s._id, label: s.slug.toLowerCase() }))"
                                    :attrs="{ form: 'mainForm' }"
                                    v-model="formData.shop"
                                />
                                <p class="fx-no-shrink mh-10">.arriere-boutique.fr/</p>

                                <input-base v-model="formData.slug" style="min-width: 120px" :attrs="{ required: true, form: 'mainForm' }"/>
                            </div>

                            <p class="ft-xs-medium mt-10">Lien final : <span class="text-underline">{{ fullLink }}</span></p>
                        </div>
                    </div>
                </transition>

                <action-fixed :is-active="changesMade && !isPreview">
                    <template slot="float">
                        <button-base class="d-none d-flex@s" :modifiers="['round', 'l']" icon-before="eye" @click="isPreview = !isPreview" />
                    </template>
                    <template slot="actions">
                        <div></div>

                        <div>
                            <link-base @click.native.prevent="reset" type="button" class="mr-10">Annuler</link-base>

                            <button-base
                                :modifiers="['gum']"
                                :class="{ 'is-disabled': !changesMade, 'is-loading': isLoading }"
                                type="submit"
                                :attrs="{ form: 'mainForm' }"
                            >
                                Sauvegarder
                            </button-base>
                        </div>
                    </template>
                </action-fixed>
            </div>
            <div class="fx-grow fx-no-shrink fx-shrink@s max-width-l" v-else>
                <placeholder class="br-s mb-10" :modifiers="['simple', 'h', 'xs']" />
                <placeholder class="br-s mb-10" :modifiers="['simple', 'h', 'xs']" />
                <placeholder class="br-s mb-20" :modifiers="['simple', 'h', 'xs']" />
                <placeholder class="br-s mb-20" :modifiers="['simple', 'h']" />
                <placeholder class="br-s mb-20" :modifiers="['simple', 'h']" />
            </div>

            <div class="PageEditor_previewContainer" :class="{ 'is-active': isPreview }">
                <div class="PageEditor_preview fx-no-shrink">
                    <template v-if="isInit">
                        <div class="PageEditor_contentScroll">
                            <div class="PageEditor_content">
                                <landing-content :is-preview="true" :content="parseForm(formData)" :shop="currentShop" />
                            </div>
                        </div>
                    </template>
                    <placeholder v-else />
                </div>
                <div class="PageEditor_previewClose" @click="isPreview = false">
                    <i class="fal fa-times color-ft-light"></i>
                </div>
            </div>
        </div>

        <module-library :is-active="isModuleLibraryActive" @close="isModuleLibraryActive = false" @add="addModule" />
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'
import Modules from '@/components/landing-modules'
import Placeholder from '~/components/base/placeholder.vue'

export default {
    name: 'DashboardPage',
    components: { InputBase, SelectBase, ToggleBase, ...Modules, Placeholder },
    middleware: 'loggedUserAndShop',
    layout: 'dashboard',
    fetchOnServer: false,
    async fetch () {
        this._id = this.$route.params.id

        if (this._id && this._id != 'new' && !this.$route.query.clone) await this.$store.dispatch('landings/get', { query: { _id: this._id } })

        this.isInit = true
    },
    data: () => ({
        _id: '',
        isLoading: true,
        isPreview: false,
        isModuleLibraryActive: false,
        isInit: false,
        photoColor: '',
        prevFormData: {},
        formData: {},
        section: 'modules',
        title: '',
        defaultData: {
            slug: 'ma-page',
            customization: {
                'background': {
                    src: 'https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg'
                },
                'background-color': '#000000',
                'background-opacity': '30',
                'background-thumbnail': 'https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            modules: [
                { id: Math.random(), type: 'title-block', position: 0, active: true, ...Modules.TitleBlockEdit.metadata.default },
                { id: Math.random(), type: 'link-list', position: 1, active: true, ...Modules.LinkListEdit.metadata.default }
            ],
            shop: '',
        }
    }),
    computed: {
        serverEntity () { return this.$store.getters['landings/findOne']({ _id: this._id }, true) },
        shops () { return this.$store.state.shop.items },
        changesMade () {
            return JSON.stringify(this.formData) != JSON.stringify(this.prevFormData)
        },
        currentShop () {
            return this.shops.find(s => s._id == this.formData.shop)
        },
        fullLink () {
            if (!this.currentShop) return ''

            let link = `https://${this.currentShop.slug}.${process.env.baseDomain}`

            if (this.formData.slug && !this.formData.isHome) link += '/' + this.formData.slug

            return link
        },
        orderedModules () {
            return [ ...this.formData.modules ].sort((a, b) => a.position - b.position)
        },
        moduleList () {
            return Object.values(Modules).filter(m => m.metadata).map(m => m.metadata.name)
        },
        navItems () {
            return [
                { label: 'Blocs', isActive: this.section == 'modules', onClick: () => this.section = 'modules' },
                { label: 'Personnalisation', isActive: this.section == 'style', onClick: () => this.section = 'style' },
                { label: 'Paramètres', isActive: this.section == 'config', onClick: () => this.section = 'config' },
            ]
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
                    ...this.defaultData,
                    ...this.formData,
                    ...form
                }

                if (!this.formData.logo && this.currentShop) this.formData.logo = this.currentShop.logo
                if (!this.formData.modules || this.formData.modules.length <= 0) this.formData.modules = this.defaultData.modules
                
                this.prevFormData = { ...this.formData }
            }
        }
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.checkChanges)
    },
    beforeRouteLeave (to, from, next) {
        if (!this.checkChanges()) {
            next()
        } else {
            if (confirm(`Tes modifications n'ont pas été enregistrées. Veux-tu vraiment quitter cette page ?`)) {
                next()
            }
        }
    },
    created () {
        if (process.client) {
            window.addEventListener('beforeunload', this.checkChanges)
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
        checkChanges (e) {
            e = e || window.event

            if (this.changesMade) {
                if (e) e.returnValue = `Tes modifications n'ont pas été enregistrées`
                return `Tes modifications n'ont pas été enregistrées`
            }

            return false
        },
        deleteModule (id) {
            this.formData.modules = this.formData.modules.filter(m => m.id != id)
        },
        addModule (module) {
            this.formData.modules = [ ...this.formData.modules, { id: Math.random(), type: module.name, active: true, position: this.formData.modules.length, ...module.default } ]
        },  
        setModule (id, value) {
            let modules = [ ...this.formData.modules].map(m => ({ ...(m.id == id ? value : m) }))
            this.formData.modules = modules.sort((a, b) => a.position - b.position).map((m, i) => ({ ...m, position: i }))
        },
        setColorPicker (value) {
            this.formData.customization = { ...this.formData.customization, ['background-color']: value == 'auto' ? this.photoColor : value }
        },
        setPhotoColor (value) {
            if (this.formData.customization['background-color'] == this.photoColor) this.setColorPicker(value)
            this.photoColor = value
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
                ...form,
                modules: [ ...form.modules ].filter(m => this.moduleList.includes(m.type))
            }
        },
        async deleteEntity () {
            let response = await this.$store.dispatch('landings/delete', this.$data._id)

            if (response) {
                this.$router.push({ path: this.localePath({ name: 'pages' }) })
            }
        },
        reset () {
            this.formData = {
                ...this.decodeForm(this.formData),
                ...this.decodeForm(this.serverEntity)
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
    .PageEditor_previewContainer {
        position: relative;
        margin-left: 30px;
        border-radius: 10px;
        min-width: 400px;
        flex-grow: 1;
        background: var(--color-bg-xweak);
    }

    .PageEditor_preview {
        margin-top: 50px;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-direction: column;
        position: sticky;
        top: 30px;
        transform-origin: top center;
        overflow: hidden;
        transform: scale(0.7);
    }

    .PageEditor_content {
        display: flex;
        flex-grow: 1;
        min-height: 100%;
    }

    .PageEditor_contentScroll {
        width: 400px;
        height: 700px;
        overflow: auto;
        flex-grow: 1;
        box-sizing: border-box;
        border-radius: 40px;
        border: 15px solid var(--color-onyx);
        
        &::-webkit-scrollbar {
            width: 0px;
        }
    }

    .Button {
        cursor: pointer;
        transition: all 150ms;

        &:hover {
            color: var(--color-ft-weak);
        }
    }

    .PageEditor_previewClose {
        display: none;
    }

    @include breakpoint-s {
        
        .PageEditor_previewContainer {
            position: fixed;
            z-index: 10;
            bottom: 0;
            margin: 0;
            min-width: 0;
            width: 100%;
            height: 100%;
            left: 0;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            overflow: hidden;
            top: 20px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0);
            transform: translateY(100%);
            transition: all 300ms ease;

            &.is-active {
                box-shadow: 0 0 0 200px rgba(0, 0, 0, 0.5);
                transform: translateY(0);
            }
        }

        .PageEditor_previewClose {
            display: block;
            position: absolute;
            top: 15px;
            right: 15px;
            line-height: 1;
            z-index: 5;
            padding: 10px;
            font-size: 30px;
        }

        .PageEditor_preview {
            margin: 0;
            border: 0;
            transform: none;
            height: 100%;
            top: 0;
            position: relative;
            display: block;
        }

        .PageEditor_contentScroll {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0;
        }
    }

</style>