<template>
    <div class="FilterCheckbox" :class="{ ...$modifiers, 'is-active': isActive }">
        <div class="FilterCheckbox_fa">
            <i class="fa-thin" :class="[ fa ]"></i>
        </div>
        <div class="FilterCheckbox_content">
            <p class="FilterCheckbox_title">{{ title|specials }}</p>
            <slot></slot>
        </div>
        <div class="FilterCheckbox_input">
            <input type="checkbox" :checked="isChecked">
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from '@instant-coffee/core'

export default {
    name: 'FilterCheckbox',
    mixins: [ ModifiersMixin ],
    props: {
        title: { type: String, default: '' },
        isActive: { type: Boolean, default: false },
        isChecked: { type: Boolean, default: false },
        fa: { type: String, default: '' },
        modifiers: { type: Array, default: () => [] }
    }
}
</script>