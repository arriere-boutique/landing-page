<template>
    <div class="LandingModule_header">
        <div class="ft-s color-current ellipsis-1">
            <b class="color-current-strong ft-m-medium"><i class="fal mr-5" :class="[`fa-${fa}`]"></i> {{ title }}</b> <span class="ft-s color-current">{{ subtitle }}</span>
        </div>

        <div class="d-flex fx-align-center">
            <p class="ft-xs-medium color-ft mr-5">Position</p>
            <p class="p-5 ft-xs-medium color-ft text-center bg-bg-light" style="width: 30px">{{ order + 1 }}</p>

            <i class="fal fa-arrow-up c-pointer ml-10" @click="() => $emit('input', value - 1.5)" :class="{ 'is-disabled': order <= 0 }"></i>
            <i class="fal fa-arrow-down c-pointer ml-10" @click="() => $emit('input', value + 1.5)" :class="{ 'is-disabled': order >= max - 1 }"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LandingModuleHeader',
    props: {
        title: { type: String },
        subtitle: { type: String },
        fa: { type: String },
        max: { type: Number },
        order: { type: Number, default: 0 },
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