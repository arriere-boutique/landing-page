<template>
    <div class="insert" v-if="node">
        <component :is="component" />
    </div>
</template>

<script>
import WhatIsCanva from '@/components/inserts/what-is-canva'

export default {
    name: 'Insert',
    components: { WhatIsCanva },
    props: {
        node: { type: Object, default: null },
    },
    computed: {
        component () { return this.$props.node.attrs.id }
    }
}
</script>

<style lang="scss" scoped>
    .insert {
        margin: 40px 0;
    }
</style>