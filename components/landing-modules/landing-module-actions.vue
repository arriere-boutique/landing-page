<template>
    <div class="d-flex fx-align-center">
        <div class="fx-grow ellipsis-1 color-ft ft-m-medium">
            <slot></slot>
        </div>
        <div class="d-flex fx-align-center">
            <link-base @click="$emit('delete')" class="mr-10" :modifiers="['pepper']" v-if="!isActive">Supprimer</link-base>
            <link-base @click="$emit('open')">Modifier</link-base>
            
            <toggle-base class="ml-10" :value="isActive" @input="$emit('toggle')" />
        </div>
    </div>
</template>

<script>
import { ToggleBase } from 'instant-coffee-core'

export default {
    name: 'LandingModuleActions',
    components: { ToggleBase },
    props: {
        isActive: { type: Boolean }
    }
}
</script>