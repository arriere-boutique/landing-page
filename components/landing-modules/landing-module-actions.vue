<template>
    <div class="d-flex fx-align-center">
        <div class="ft-xs-medium d-flex fx-align-center fx-grow color-ft">
            <div class="d-flex fx-align-center" v-if="startDate || endDate">
                <i class="fal fa-clock fa-lg"></i>

                <div class="ml-10 line-2">
                    <p v-if="startDate" @mouseenter="(e) => $tOpen(`Ce bloc sera visible à partir du ${startDate.format('D MMMM YYYY à H:mm')}`, e)" @mouseleave="$tClose">Sera visible {{ startDate.fromNow() }}</p>

                    <p v-if="endDate && endDate == true" @mouseleave="$tClose">Bloc caché le {{ $moment(data.endDate).format('D MMMM YYYY à H:mm') }}</p>
                    <p v-else-if="endDate" @mouseenter="(e) => $tOpen(`Ce bloc sera caché à partir du ${endDate.format('D MMMM YYYY à H:mm')}`, e)" @mouseleave="$tClose">Sera caché {{ endDate.fromNow() }}</p>
                </div>
            </div>
        </div>
        <div class="d-flex fx-align-center">
            <!-- <link-base @click="$emit('delete')" class="mr-10" :modifiers="['pepper']" v-if="!isActive">Supprimer</link-base> -->

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
        data: { type: Object, default: () => ({}) }
    },
    computed: {
        isActive () {
            let active = this.data.active

            if (this.data.startDate) active = this.$moment(this.data.startDate).isBefore(this.$moment())
            if (this.data.endDate && this.$moment(this.data.endDate).isBefore(this.$moment())) active = false

            return active
        },
        startDate () {
            let sd = this.data.startDate ? this.$moment(this.data.startDate) : null

            if (sd) {
                if (sd.isBefore(this.$moment())) sd = null
            }
            
            return sd
        },
        endDate () {
            let ed = this.data.endDate ?  this.$moment(this.data.endDate) : null

            if (ed) if (ed.isBefore(this.$moment())) ed = true
            
            return ed
        }
    }
}
</script>