<template>
    <button-editor
        :sub-menu="true"
        :is-active="state.active || (currentNode && currentNode.level ? true : false)"
        icon="text-size"
        @click="state.active = !state.active"
    >
        <template slot="list">
            <div
                v-for="option in options"
                class="TextBody item Block ellipsis-1"
                :class="[{ 'is-active': currentNode && option.value == currentNode.level }, ...option.classes]"
                @click="$emit('update', { block: option.value })"
                :key="option.value"
                v-html="sample"
            >
            </div>
        </template>
    </button-editor>
</template>

<script>
export default {
    name: 'ButtonHeadings',
    props: {
        sample: { type: String, default: '<b>Voyez ce koala</b> fou qui mange des journaux et des photos dans un bungalow. ' },
        currentNode: { type: [Object, Boolean], default: false },
        options: { type: Array, default: () => ([
            { label: 'Amber', value: 'amber', classes: ['Block--amber'] },
            { label: 'amethyst', value: 'amethyst', classes: ['Block--amethyst'] },
            { label: 'ruby', value: 'ruby', classes: ['Block--ruby'] },
            { label: 'onyx', value: 'onyx', classes: ['Block--onyx'] },
            { label: 'malachite', value: 'malachite', classes: ['Block--malachite'] },
            { label: 'Image display', value: 'display', classes: ['Block--display'] },
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
    }
</style>