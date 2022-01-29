<template>
    <popin-base :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
        <template slot="content">
            <div class="p-60">
                <div class="row-xs">
                    <div class="col-4 mb-10" v-for="module in availableModules" :key="module.name">
                        <module-tile v-bind="module" @click.native="$emit('close'); $emit('add', module)" />
                    </div>
                </div>

                <div v-if="unavailableModules.length > 0">
                    <p class="mt-40 mb-10 ft-s-bold">Non-disponibles</p>

                    <div class="row-xs">
                        <div class="col-4 mb-10" v-for="module in unavailableModules" :key="module.name">
                            <module-tile  v-bind="module" :has-requirements="hasRequirements(module)" />
                        </div>
                    </div>
                </div>

                <div v-if="developingModules.length > 0">
                    <p class="mt-40 mb-10 ft-s-bold">En cours en développement</p>

                    <div class="row-xs">
                        <div class="col-4 mb-10" v-for="module in developingModules" :key="module.name">
                            <module-tile v-bind="module" />
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
        shops () { return this.$store.state.shop.items },
        modules () {
            return Object.values(Modules).filter(m => m.metadata).map(m => m.metadata)
        },
        availableModules () {
            return this.modules.filter(m => !m.dev && !this.hasRequirements(m))
        },
        unavailableModules () {
            return this.modules.filter(m => !m.dev && this.hasRequirements(m))
        },
        developingModules () {
            return this.modules.filter(m => m.dev)
        }
    },
    methods: {
        hasRequirements (metadata) {
            let required = []

            if (metadata.requirements) {
                required = metadata.requirements.reduce((total, requirement) => {
                    if (requirement == 'shop' && this.shops.length <= 0) return [ ...total, requirement ]
                    return total
                }, [])
            }

            return required.length > 0 ? required : false
        }
    }
}
</script>