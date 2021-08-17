<template>
    <fieldset class="InputIcon">
        <legend class="InputIcon_label" v-if="label">{{ label }}</legend>

        <div class="InputIcon_row row-2xs">
            <label
                v-for="choice in choices.slice(0, limit && !state.showAll ? limit : 9999)"
                class="mb-3"
                :class="[`col-${cols}`]"
                :key="choice.value"
            >   
                <div class="InputIcon_choice">
                    <input class="InputIcon_input" type="radio" :value="choice" :name="name" v-bind="attrs" v-model="value" @click="$emit('input', choice)" />

                    <div class="InputIcon_icon">
                        <i class="fal" :class="[`fa-${choice}`]"></i>
                    </div>
                </div>
            </label>

            <div class="col-12 mt-3" v-if="!state.showAll && limit !== false">
                <button-base
                    :modifiers="['weak', 's', 'center']"
                    :attrs="{ type: 'button' }"
                    text="Afficher tout"
                    @click.stop="state.showAll = true"
                />
            </div>
        </div>
    </fieldset>
</template>

<script>
import ICONS from '@/static/icons'
import { randomizeArray } from '@/utils/base'

export default {
    name: 'InputIcon',
    props: {
        label: { type: String, default: '' },
        name: { type: String, default: 'input-icon' },
        limit: { type: [Number, Boolean], default: false },
        cols: { type: Number, default: 2 },
        value: { type: String, default: '' },
        choices: { type: Array, default: () => [] },
        attrs: { type: Object, default: () => {} }
    },
    data: () => ({
        state: {
            showAll: false
        }
    }),
    mounted () {
        if (this.$props.choices.length <= 0) this.$props.choices = ICONS
    },
    methods: {
        reset () {
            this.$data.state.showAll = false
        }
    }
}
</script>