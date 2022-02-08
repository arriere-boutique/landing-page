<template>
    <div class="LandingModule_header">
        <div>
            <div class="ft-s color-current ellipsis-1">
                <b class="color-current-strong ft-m-medium"><i class="fal mr-5" :class="[`fa-${metadata.fa}`]"></i> {{ metadata.title }}</b>
            </div>

            <div class="Tag Tag--s mt-5"><span>{{ subtitle }}</span></div>
        </div>

        <div class="d-flex fx-align-center fx-no-shrink">
            <i class="fal fa-arrow-up c-pointer ml-10" @click="() => $emit('input', value - 1.5)" :class="{ 'is-disabled': false }"></i>
            <i class="fal fa-arrow-down c-pointer ml-10" @click="() => $emit('input', value + 1.5)" :class="{ 'is-disabled': false }"></i>

            <quick-menu class="ml-10" :items="[
                { label: 'Modifier', action: () => this.$emit('edit') },
                { label: 'Supprimer définitivement', action: () => this.$emit('delete') },
            ]" />
        </div>

    </div>
</template>

<script>
export default {
    name: 'LandingModuleHeader',
    props: {
        subtitle: { type: String },
        metadata: { type: Object, default: () => ({}) },
        max: { type: Number },
        value: { type: Number, default: 0 }
    }
}
</script>

<style scoped>
    .is-disabled {
        pointer-events: none;
        opacity: 0.25;
    }
</style>