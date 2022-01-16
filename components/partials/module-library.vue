<template>
    <popin-base :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
        <template slot="content">
            <div class="p-60">
                <div class="row-xs">
                    <div class="col-4" v-for="module in modules" :key="module.name">
                        <div class="Module Tile" :class="[ `is-${module.color}` ]" @click="$emit('close'); $emit('add', module)">
                            <p class="ft-l color-current-strong">
                                <i class="fal fa-link" :class="[ `fa-${module.fa}` ]"></i>
                            </p>

                            <div class="mt-30">
                                <p class="ft-l-bold">{{ module.title }}</p>
                                <p class="ft-s-medium mt-5">{{ module.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </popin-base>
</template>

<script>
import Modules from '@/components/landing-modules'

export default {
    name: 'ModuleLibrary',
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({

    }),
    computed: {
        modules () {
            return Object.values(Modules).filter(m => m.metadata).map(m => m.metadata)
        }
    }
}
</script>

<style lang="scss" scoped>
    .Module {
        cursor: pointer;
    }
</style>