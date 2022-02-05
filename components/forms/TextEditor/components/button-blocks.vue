<template>
    <button-editor
        :sub-menu="true"
        :is-active="state.active || (currentNode && currentNode.level ? true : false)"
        icon="cube"
        @click="state.active = !state.active"
    >
        <template slot="list">
            <div
                v-for="option in options"
                class="TextBody item Block"
                :class="[{ 'is-active': currentNode && option.value == currentNode.level }, ...option.classes]"
                @click="$emit('update', { block: option.value })"
                :key="option.value"
                v-html="option.label + ' | ' + sample"
            >
            </div>
        </template>
    </button-editor>
</template>

<script>
export default {
    name: 'ButtonHeadings',
    props: {
        sample: { type: String, default: '<b>Voyez ce koala</b> fou qui mange des journaux. ' },
        currentNode: { type: [Object, Boolean], default: false },
        options: { type: Array, default: () => ([
            { label: 'Image', value: 'image', classes: ['Block--image'] },
            { label: 'Checklist', value: 'checklist', classes: ['Block--checklist'] },
            { label: 'Pond', value: 'pond', classes: ['is-pond'] },
            { label: 'Gum', value: 'gum', classes: ['is-gum'] },
            { label: 'ice', value: 'ice', classes: ['is-ice'] },
            { label: 'Precious', value: 'precious', classes: ['is-precious'] }
        ]) }
    },
    data: () => ({
        state: {
            active: false
        }
    })
}
</script>

<style lang="scss" scoped>
    .item {
        font: var(--ft-l);
        padding: 10px;
        cursor: pointer;
        border-radius: 6px;
        color: var(--color-ft);
        text-align: left;
        overflow: hidden;
        margin: 5px 0;
    }
</style>