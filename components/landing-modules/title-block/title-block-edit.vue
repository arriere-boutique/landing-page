<template>
    <div>
        <landing-module
            :metadata="$options.metadata"
            :form-data="formData"
            :title="`‟${module.title}”`"
        >
            <input-base label="Titre" v-model="formData.title" :attrs="{ required: true }" />
            <textarea v-model="formData.paragraph" class="mt-10" placeholder="Texte"></textarea>
        </landing-module>
    </div>
</template>

<script>
import LandingModuleMixin from '../landing-module-mixin'

export default {
    name: 'TitleBlockEdit',
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