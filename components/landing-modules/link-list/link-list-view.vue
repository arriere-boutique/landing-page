<template>
    <transition-group tag="div" name="default" class="LinkList">
        <button-base
            class="LinkList_item"
            :modifiers="['full', 'light']"
            v-for="link in links.filter(l => l.active)"
            tag="a"
            :link="link.href"
            :target="isPreview ? true : false"
            :key="link.id"
        >
            {{ link.label }}
        </button-base>
    </transition-group>
</template>

<script>
export default {
    name: 'LinkListView',
    props: {
        links: { type: Array, default: () => [] },
        isPreview: { type: Boolean, default: false }
    }
}
</script>

<style lang="scss" scoped>
    .LinkList_item {
        margin: 10px auto;
    }
</style>