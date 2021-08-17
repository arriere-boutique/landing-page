<template>
    <component
        :is="tag ? tag : (link || (node && node.attrs.link) ? 'a' : 'div')"
        class="LinkBase"
        :target="target"
        :href="node && node.attrs.link ? node.attrs.link : link"
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
export default {
    name: 'LinkBase',
    props: {
        tag: { type: [String, Boolean], default: false },
        fa: { type: [ String, Boolean ], default: false },
        target: { type: String, defaut: '_self' },
        node: { type: Object, default: () => {} },
        link: { type: [ String, Boolean ], default: false },
        attrs: { type: Object, default: () => {} },
    }
}
</script>