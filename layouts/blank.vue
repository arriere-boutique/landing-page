<template>
    <div class="Layout" :class="[`is-${color}`, classes ]">
        <Nuxt />
        
        <tooltip-manager />
        <flashes-manager />
        <popin-manager />
    </div>
</template>

<script>
import { TooltipManager } from 'instant-coffee-core'

export default {
    name: 'LayoutBlank',
    components: { TooltipManager },
    computed: {
        color () { return this.$store.state.page.body.color },
        classes () { return this.$store.state.page.body.classes }
    }
}
</script>