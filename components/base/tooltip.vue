<template>
    <span class="TooltipIcon" @mouseenter="(e) => $tOpen(text, e)" @mouseleave="$tClose">
        <i class="fal fa-circle-question"></i>
    </span>
</template>

<script>
export default {
    name: 'Tooltip',
    props: {
        text: { type: String }
    }
}
</script>

<style lang="scss" scoped>
    .TooltipIcon {
        font-size: 0.8em;
    }
</style>