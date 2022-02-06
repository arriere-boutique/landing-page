<template>
    <div
        class="LandingModule"
        :class="[
            `is-${metadata.color}`,
            { 
                'is-disabled': formData.active == false && this.isStarted == null || this.isPast == true,
                'is-programmed': isStarted == false
            }
        ]"
    >
        <landing-module-header
            :subtitle="title"
            :value="formData.position"
            :max="modules.length"
            :metadata="metadata"
            @input="$parent.changePosition"
            @edit="isPopinActive = true"
            @delete="$parent.delete"
        />

        <landing-module-actions
            :data="formData"
            @open="isPopinActive = true"
            @toggle="$parent.toggle(!isModuleActive)"
        />
        
        <landing-module-popin
            :is-active="isPopinActive"
            :metadata="metadata"
            @reset="$parent.reset"
            @submit="$parent.submit"
            @close="isPopinActive = false"
            @input="$parent.input"
            :value="formData"
            :module="module"
        >
            <slot></slot>
        </landing-module-popin>
    </div>
</template>

<script>
export default {
    name: 'ListLinkEdit',
    props: {
        title: { type: String, default: '' },
        metadata: { type: Object, default: () => {} },
        formData: { type: Object, default: () => {} },
        module: { type: Object, default: () => {} },
        modules: { type: Array, default: () => [] }
    },
    data: () => ({
        isPopinActive: false
    }),
    computed: {
        isPast () {
            return this.formData.endDate ? this.$moment(this.formData.endDate).isBefore(this.$moment()) : null
        },
        isStarted () {
            return this.formData.startDate ? this.$moment(this.formData.startDate).isBefore(this.$moment()) : null
        },
        isModuleActive () {
            let active = this.formData.active

            if (this.formData.startDate) active = this.isStarted
            if (this.formData.endDate && this.isPast) active = false

            return active
        }
    }
}
</script>

<style>

</style>