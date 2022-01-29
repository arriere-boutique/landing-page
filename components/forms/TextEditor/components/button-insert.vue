<template>
    <button-editor
        :sub-menu="true"
        :is-active="state.active || (currentNode && currentNode.level ? true : false)"
        icon="plus-square"
        @click="state.active = !state.active"
    >
        <template slot="list">
            <div
                v-for="option in options"
                class="item"
                :class="{ 'is-active': currentNode && option.value == currentNode.level }"
                @click="$emit('update', { id: option.value })"
                :key="option.value"
                v-html="option.label"
            >
            </div>
        </template>
    </button-editor>
</template>

<script>
export default {
    name: 'ButtonInsert',
    props: {
        currentNode: { type: [Object, Boolean], default: false },
        options: { type: Array, default: () => ([
            { label: `C'est quoi Canva ?`, value: 'what-is-canva' },
            { label: `Générateur de tags`, value: 'tag-generator' },
            { label: `Calculatrice de profits`, value: 'profit-calculator' },
            { label: `Créer son Arrière Boutique`, value: 'register' },
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