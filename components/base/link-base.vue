<template>
    <component
        :is="tag ? tag : (href || link || (node && node.attrs.link) ? 'a' : 'div')"
        class="LinkBase"
        :class="[ ...$modifiers ]"
        :target="target"
        :href="node && node.attrs.link ? node.attrs.link : (link ? link : href)"
        v-bind="attrs"
        @click="$emit('click')"
    >
        <div class="LinkBase_content">
            <slot></slot>

            <i class="fal" :class="[`fa-${fa}`]" v-if="fa"></i>
        </div>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
export default {
    name: 'LinkBase',
    mixins: [ ModifiersMixin ],
    props: {
        tag: { type: [String, Boolean], default: false },
        fa: { type: [ String, Boolean ], default: false },
        target: { type: String, defaut: '_self' },
        node: { type: Object, default: () => {} },
        link: { type: [ String ], default: '' },
        href: { type: [ String ], default: '' },
        attrs: { type: Object, default: () => {} },
    }
}
</script>