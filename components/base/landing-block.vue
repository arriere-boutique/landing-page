<template>
    <div
        class="LandingBlock"
        :class="{ 'is-disabled': !isActive, ...$modifiers }"
    >
        <nuxt-link class="LandingBlock_cover" :to="localePath({ name: 'pages-id', params: { id: _id } })">
            <landing-content class="LandingBlock_contentPreview" :is-preview="true" :content="{ title, slug, logo, customization, links }" />
        </nuxt-link>

        <div class="LandingBlock_content">
            <p class="ft-m-medium line-1 ellipsis-1">{{ title }}</p>

            <div class="d-flex fx-justify-between fx-align-center">
                <div>
                    <toggle-base v-model="formData.isActive" class="mr-10" v-if="!isHome" />
                </div>

                <button-base class="mt-20" :modifiers="['secondary', 'xs']" :class="{ 'is-disabled': !isActive }" icon-before="copy" @click="$copy(link)">
                    Copier lien
                </button-base>
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
        height: 200px;
        position: relative;
        overflow: hidden;

        &::before {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
    }

    .LandingBlock_contentPreview {
        height: 500px;
        position: absolute !important;
        top: 0;
        left: 0;
        width: 200% !important;
        transform: scale(0.5) translate3d(-50%, -50%, 0);
        pointer-events: none;
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