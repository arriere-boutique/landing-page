<template>
    <div class="LayoutDefault" :class="[`LayoutDefault--${color}`]">
        <header-base />
        
        <div class="LayoutDefault_content">
            <Nuxt />

            <footer-base />
        </div>

        <tooltip-manager />
    </div>
</template>

<script>
import { TooltipManager } from '@instant-coffee/core'

export default {
    name: 'LayoutDefault',
    components: { TooltipManager },
    computed: {
        color () { return this.$store.state.page.body.color }
    }
}
</script>