<template>
    <button
        class="TextEditor_button"
        :class="{ 'TextEditor_button--sub': subMenu, 'is-active': isActive }"
        type="button"
        @click="$emit('click')"
    >
        <i class="fal" :class="[`fa-${icon}`]" v-if="icon"></i>

        <div class="TextEditor_list" v-if="$slots['list']">
            <slot name="list"></slot>
        </div>
    </button>
</template>

<script>
export default {
    name: 'ButtonEditor',
    props: {
        subMenu: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false },
        icon: { type: [String, Boolean], default: false }
    }
}
</script>