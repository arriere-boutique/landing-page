<template>
    <span class="TooltipIcon" @mouseenter="(e) => $tOpen(text, e)" @mouseleave="$tClose">
        <i class="fal" :class="[ `fa-${icon}` ]"></i>
    </span>
</template>

<script>
export default {
    name: 'Tooltip',
    props: {
        text: { type: String },
        icon: { type: String, default: 'circle-question' }
    }
}
</script>

<style lang="scss" scoped>
    .TooltipIcon {
        font-size: 0.8em;
    }
</style>