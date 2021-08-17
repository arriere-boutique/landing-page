<template>
    <transition-group tag="div" name="appear-simple" class="Flashbag">
        <flash-message
            :modifiers="[ flash.type ]"
            v-for="flash in flashbag"
            v-bind="flash"
            @done="onDone"
            :key="flash.id"
        />
    </transition-group>
</template>

<script>
import FlashMessage from './FlashMessage'

export default {
    name: 'Flashbag',
    components: { FlashMessage },
    computed: {
        flashbag () {
            return this.$store.state.utils.flashbag
        }
    },
    methods: {
        onDone (id) {
            this.$store.commit('utils/endFlash', id)
        }
    }
}
</script>

