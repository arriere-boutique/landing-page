<template>
    <div class="Insert" v-if="node">
        <component :is="component" :is-insert="true" :modifiers="['insert']" />
    </div>
</template>

<script>
import WhatIsCanva from '@/components/inserts/what-is-canva'
import TagGenerator from '@/components/tools/tag-generator'
import ProfitCalculator from '@/components/tools/profit-calculator'

export default {
    name: 'Insert',
    components: { WhatIsCanva, TagGenerator, ProfitCalculator },
    props: {
        node: { type: Object, default: null },
    },
    computed: {
        component () { return this.$props.node.attrs.id }
    }
}
</script>

<style lang="scss" scoped>
    .Insert {
        margin: 40px 0;
    }
</style>