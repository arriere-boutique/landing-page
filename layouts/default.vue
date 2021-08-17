<template>
    <div class="LayoutDefault LayoutDefault--ruby">
        <header-base />
        
        <div class="LayoutDefault_content">
            <Nuxt />
        </div>

        <tooltip-manager />
    </div>
</template>

<script>
import { TooltipManager } from '@instant-coffee/core'

export default {
    name: 'LayoutDefault',
    components: { TooltipManager }
}
</script>