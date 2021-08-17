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
                class="TextBody item"
                :class="{ 'is-active': currentNode && option.value == currentNode.level }"
                @click="$emit('update', option.value)"
                :key="option.value"
            >
                <p class="label">{{ option.label }}</p>

                <component class="title" :is="option.component">
                    {{ sample }}
                </component>
            </div>
        </template>
    </button-editor>
</template>

<script>
export default {
    name: 'ButtonHeadings',
    props: {
        sample: { type: String, default: 'Voyez ce koala fou qui mange des journaux et des photos dans un bungalow. ' },
        currentNode: { type: [Object, Boolean], default: false },
        options: { type: Array, default: () => ([
            { label: 'Titre 1', value: 1, component: 'h1' },
            { label: 'Titre 2', value: 2, component: 'h2' },
            { label: 'Titre 3', value: 3, component: 'h3' },
            { label: 'Titre 4', value: 4, component: 'h4' },
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
        display: flex;
        align-items: center;
        min-height: 50px;
        margin: 5px;
        padding: 0 10px;
        cursor: pointer;
        transition: all 100ms ease;
        border-radius: 6px;
        color: var(--color-ft-weak);

        &:hover,
        &.is-active {
            color: var(--color-ft);
            background-color: var(--color-bg-xweak);
        }
    }

    .label {
        font: var(--ft-s);
        line-height: 1;
        color: var(--color-ft-weak);
        margin-right: 15px;
        flex-shrink: 0;
    }

    .title {
        margin: 0;
        text-align: left;
        color: inherit;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>