<template>
    <div class="LandingModule" :class="[ `is-${$options.metadata.color}` ]">
        <landing-module-header
            :subtitle="`‟${module.title}”`"
            :value="formData.position"
            :max="moduleCount"
            :order="order"
            :data="formData"
            v-bind="$options.metadata"
            @input="changePosition"
        />

        <landing-module-actions
            :is-active="formData.active"
            @open="isActive = true"
            @toggle="toggle"
            @delete="$emit('delete')"
        />
        
        <landing-module-popin :is-active="isActive" @reset="reset" @submit="submit" @close="isActive = false" v-bind="$options.metadata" v-model="formData">
            <input-base label="Titre" v-model="formData.title" :attrs="{ required: true }" />
            <textarea v-model="formData.paragraph" class="mt-10" placeholder="Texte"></textarea>
        </landing-module-popin>
    </div>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'ListLinkEdit',
    mixins: [ LandingModuleMixin ],
    metadata: {
        name: 'title-block',
        fa: 'text',
        color: 'ice',
        title: 'Zone de texte',
        description: `Affiche du texte sur ta page.`,
        default: {
            title: 'Premier texte',
            paragraph: 'Deuxième texte'
        }
    }
}
</script>

<style>

</style>