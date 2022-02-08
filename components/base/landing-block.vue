<template>
    <div
        class="LandingBlock is-ice"
        :class="{ 'is-disabled': !isActive, ...$modifiers }"
        @click="goEdit"
    >
        <div class="LandingBlock_cover"  :style="{ backgroundImage: `url(${customization['background-thumbnail'] ? customization['background-thumbnail'] : ''})` }">
        </div>

        <div class="LandingBlock_content">
            <p class="ft-m-medium ellipsis-2 line-2 mb-10" style="min-height: 48px">{{ title ? title : 'Ma page' }}</p>

            <div class="d-flex fx-justify-between fx-align-center">
                <div class="fx-grow mr-5">
                    <button-base :modifiers="['secondary', 'xs', 'full']" :link="link" tag="a" target="_blank" :class="{ 'is-disabled': !isActive }" icon-before="arrow-up-right-from-square" @click.native.stop>
                        Voir
                    </button-base>
                </div>

                <button-base :modifiers="['secondary', 'xs']" :class="{ 'is-disabled': !isActive }" icon-before="link" @click.native.stop="$copy(link)">
                    Copier le lien
                </button-base>
            </div>

            <div class="d-flex fx-justify-between fx-align-center mt-20">
                <div class="Tag Tag--s n-ml-0" v-if="isHome">
                    <i class="fal fa-home mr-5"></i>
                    Page d'accueil
                </div>
                <div v-else>
                    <toggle-base v-model="formData.isActive" class="mr-10" v-if="!isHome" :label="formData.isActive ? 'Page active' : 'Page désactivée'" @click.native.stop />
                </div>
            </div>
        </div>

        <div class="LandingBlock_footer">

        </div>
    </div>
</template>

<script>
import { ModifiersMixin, ToggleBase } from 'instant-coffee-core'

export default {
    name: 'LandingBlock',
    components: { ToggleBase },
    mixins: [ ModifiersMixin ],
    props: {
        _id: { type: String },
        title: { type: String },
        slug: { type: String },
        logo: { type: String },
        isHome: { type: Boolean },
        isActive: { type: Boolean },
        customization: { type: Object },
        link: { type: String, default: '' },
        links: { type: Array },
        modifiers: { type: Array, default: () => [] }
    },
    data: () => ({
        formData: {
            isActive: true
        }
    }),
    watch: {
        isActive: {
            immediate: true,
            handler (v) {
                this.formData.isActive = v
            }
        },
        ['formData.isActive'] (v) {
            if (v != this.isActive) {
                this.$store.dispatch('landings/create', {
                    _id: this._id,
                    params: { isActive: v }
                })
            }
        }
    },
    methods: {
        goEdit () {
            this.$router.push(this.localePath({ name: 'pages-id', params: { id: this._id } }))
        }
    }
}
</script>

<style lang="scss" scoped>
    .LandingBlock {
        display: block;
        border: 1px solid var(--color-border);
        border-radius: 15px;
        background: var(--color-bg-light);
        overflow: hidden;
        transition: all 150ms ease;
        cursor: pointer;
        box-shadow: 0 0 2px 0px var(--color-shadow);

        &:hover {
            transform: translateY(-3px);
            opacity: 1;
            box-shadow: 0 3px 12px 0px var(--color-shadow);
        }

        &.is-disabled {
            opacity: 0.5;

            &:hover {
                opacity: 1;
            }
        }
    }
    .LandingBlock_cover {
        display: flex;
        height: 75px;
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        background-color: var(--color-bg-weak);
    }

    .LandingBlock_content {
        text-align: center;
        padding: 20px;
    }

    .LandingBlock_footer {
        display: flex;
        border-top: 1px solid var(--color-border);
        text-align: center;

        & > div {
            flex: 1 1 0px;
            padding: 10px;
            font: var(--ft-m-medium);
            border-right: 1px solid var(--color-border);

            &:last-child {
                border: none;
            }
        }
    }
</style>