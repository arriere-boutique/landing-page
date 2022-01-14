<template>
    <nuxt-link
        :to="localePath({ name: 'pages-slug', params: { slug: slug } })"
        class="LandingBlock"
        :class="[ $modifiers ]"
    >
        <div class="LandingBlock_cover">
            <landing-content class="LandingBlock_contentPreview" :is-preview="true" :content="{ title, slug, logo, customization, links }" />
        </div>

        <div class="LandingBlock_content">
            <p class="ft-m-medium line-1 ellipsis-1">{{ title }}</p>

            <button-base class="mt-20" :modifiers="['secondary', 'xs']" icon-before="copy" @click="$copy(fullLink)">
                Copier lien
            </button-base>
        </div>

        <div class="LandingBlock_footer">

        </div>
    </nuxt-link>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'LandingBlock',
    mixins: [ ModifiersMixin ],
    props: {
        title: { type: String },
        slug: { type: String },
        logo: { type: String },
        customization: { type: Object },
        link: { type: String, default: '' },
        links: { type: Array },
        modifiers: { type: Array, default: () => [] }
    },
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
            box-shadow: 0 3px 12px 0px var(--color-shadow);
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