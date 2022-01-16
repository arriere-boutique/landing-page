<template>
    <div class="LandingModule_header">
        <p>{{ title }}</p>

        <div class="d-flex fx-align-center">
            <p class="p-5 ft-xs-medium color-ft text-center bg-bg-light" style="width: 30px">{{ order }}</p>

            <i class="fal fa-arrow-up c-pointer ml-10" @click="() => $emit('input', value - 1)" v-if="order > 0"></i>
            <i class="fal fa-arrow-down c-pointer ml-10" @click="() => $emit('input', value + 1)" v-if="order < max - 1"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LandingModuleHeader',
    props: {
        title: { type: String },
        max: { type: Number },
        order: { type: Number, default: 0 },
        value: { type: Number, default: 0 }
    }
}
</script>