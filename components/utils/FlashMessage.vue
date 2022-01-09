<template>
    <div class="FlashMessage" :class="{ ...$modifiers }" @click="$emit('done', id)">
        <p classs="FlashMessage_text">
            <i class="fal mr-5" :class="[`fa-${icon}`]" v-if="icon"></i> {{ text }}
        </p>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'FlashMessage',
    mixins: [ ModifiersMixin ],
    props: {
        id: { type: String },
        text: { type: String },
        icon: { type: String, default: '' }
    },
    mounted () {
        setTimeout(() => {
            this.$emit('done', this.$props.id)
        }, 4000)
    }
}
</script>

