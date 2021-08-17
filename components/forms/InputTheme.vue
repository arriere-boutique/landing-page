<template>
    <fieldset class="InputTheme">
        <legend class="InputTheme_label" v-if="label">{{ label }}</legend>

        <div class="InputTheme_row">
            <label
                v-for="choice in choices"
                class="InputTheme_choice"
                :key="choice.value"
            >
                <input class="InputTheme_input" type="radio" :value="choice.value" :name="name" v-bind="attrs" v-model="value" @click="$emit('input', choice.value)" />
                <div class="InputTheme_color" :class="[`is-${choice.value}`]"></div>
            </label>
        </div>
    </fieldset>
</template>

<script>
export default {
    name: 'InputTheme',
    props: {
        label: { type: String, default: '' },
        name: { type: String, default: 'input-theme' },
        value: { type: String, default: '' },
        choices: { type: Array, default: () => [
            { value: 'cherry' },
            { value: 'blueberry' },
            { value: 'pineapple' },
            { value: 'plum' },
            { value: 'cucumber' },
            { value: 'grape' },
            { value: 'peach' },
            { value: 'strawberry' },
            { value: 'blackberry' },
        ] },
        attrs: { type: Object, default: () => {} }
    }
}
</script>