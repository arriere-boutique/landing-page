<template>
    <div>
        <div>
            <transition-group name="default" tag="div">
                <component
                    v-for="module in orderedModules" :key="module.id" class="mb-10"
                    :is="module.type + '-edit'"
                    :modules="orderedModules"
                    :module="module"
                    @input="(v) => setModule(module.id, v)"
                    @delete="() => deleteModule(module.id)"
                />
            </transition-group> 

            <div class="bg-bg-xweak d-flex fx-align-center fx-justify-center br-m p-20">
                <link-base fa="plus" @click.native.prevent="isModuleLibraryActive = true">Ajouter un module</link-base>
            </div>
        </div>

        <module-library :is-active="isModuleLibraryActive" @close="isModuleLibraryActive = false" @add="addModule" />
    </div>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'
import Modules from '@/components/landing-modules'

export default {
    name: 'LandingModules',
    components: { InputBase, SelectBase, ToggleBase, ...Modules },
    props: {
        formData: { type: Object }
    },
    data: () => ({
        isModuleLibraryActive: false,
    }),
    computed: {
        orderedModules () {
            return [ ...this.formData.modules ].sort((a, b) => a.position - b.position)
        },

    },
    methods: {
        deleteModule (id) {
            this.formData.modules = this.formData.modules.filter(m => m.id != id)
        },
        addModule (module) {
            this.formData.modules = [ ...this.formData.modules, { id: Math.random(), type: module.name, active: true, position: this.formData.modules.length, ...module.default } ]
        },  
        setModule (id, value) {
            let modules = [ ...this.formData.modules].map(m => ({ ...(m.id == id ? value : m) }))
            this.formData.modules = modules.sort((a, b) => a.position - b.position).map((m, i) => ({ ...m, position: i }))
        }
    }
}
</script>

<style>

</style>