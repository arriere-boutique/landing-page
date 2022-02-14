<template>
    <div class="PageEditor Wrapper--left Wrapper--m pb-100">
        <div class="d-flex fx-align-center mv-40">
            <breadcrumbs class="fx-no-shrink fx-shrink@s" :items="[
                { label: 'Pages', to: { name: 'pages' } },
                { label: fullLink ? fullLink : 'Ma page', href: fullLink ? fullLink : '' },
            ]" />
        </div>

        <div class="d-flex">
            <form id="mainForm" @submit.prevent="update"></form>

            <div class="fx-grow" v-if="isInit">
                <nav-body
                    class="mb-20"
                    v-model="section"
                    :items="navItems"
                />

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
            <div class="fx-grow fx-no-shrink fx-shrink@s" v-else>
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
        isInit: false,
        prevFormData: {},
        formData: {},
        title: '',
        defaultData: {
            slug: 'ma-page',
            hideBrand: false,
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
        moduleList () {
            return Object.values(Modules).filter(m => m.metadata).map(m => m.metadata.name)
        },
        fullLink () {
            if (!this.currentShop) return ''

            let link = `https://${this.currentShop.slug}.${process.env.domains[this.currentShop.domain]}`

            if (this.formData.slug && !this.formData.isHome) link += '/' + this.formData.slug

            return link
        },
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'landing-modules',
                    props: { formData: this.formData },
                    label: 'Blocs'
                }, {
                    id: 'style',
                    component: 'landing-customization',
                    props: { formData: this.formData },
                    label: 'Personnalisation'
                }, {
                    id: 'config',
                    component: 'landing-settings',
                    props: { formData: this.formData },
                    label: 'Paramètres'
                },
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
                this.$router.push({ path: this.localePath({ name: 'pages-id', params: { id: response._id }, query: { section: this.section } }) })
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
        width: 400px;
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