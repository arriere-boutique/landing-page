<template>
    <div class="Block">
        <div class="p-15" v-if="currentStatus">
            <p class="ft-m-bold mb-20">Options de publication</p>

            <select-base
                :value="currentStatus.id"
                @input="onStatusChange"
                :options="STATUSES"
                :multiple="false"
            />

            <slot></slot>
        </div>

        <div class="bg-bg-xweak b-top b-bottom" v-show="state.advancedOptions">
            <div class="d-flex fx-align-center p-15">
                <p class="ft-s color-ft-weak fx-grow pr-20">Supprimer définitivement</p>

                <button-base
                    class="fx-no-shrink"
                    :modifiers="['xs', 'secondary', 'error']"
                    @click="$store.commit('utils/confirm', { text: `Vraaaiment ?`, confirm: { text: 'Supprimer', modifiers: ['s', 'error'], callback: $emit('delete') } })"
                >
                    Supprimer
                </button-base>
            </div>
        </div>

        <div class="d-flex fx-align-center bg-bg-weak p-10">
            <div class="fx-grow pr-10">
                <button-base
                    :modifiers="['weak', 'light', 's']"
                    :icon-after="state.advancedOptions ? 'angle-up' : 'angle-down'"
                    @click="state.advancedOptions = !state.advancedOptions"
                >
                    Avancé
                </button-base>
            </div>

            <button-base
                class="fx-no-shrink"
                :modifiers="['s']"
                @click="$emit('save')"
            >
                Sauvegarder
            </button-base>
        </div>
    </div>
</template>

<script>
const STATUSES = [
    { id: 0, label: 'En préparation', value: 'draft' },
    { id: 1, label: 'Publié', value: 'published' },
    { id: 2, label: 'Caché', value: 'hidden' },
]

import { SelectBase } from '@instant-coffee/core'

export default {
    name: 'EntityControl',
    components: { SelectBase },
    props: {
        status: { type: String, default: '' }
    },
    data: () => ({
        STATUSES,
        currentStatus: '',
        state: {
            advancedOptions: false
        }
    }),
    watch: {
        status: {
            immediate: true,
            handler (v) {
                this.$data.currentStatus = STATUSES.find(i => i.value == v)
            }
        }
    },
    methods: {
        onStatusChange (v) {
            let value = STATUSES.find(i => i.id == v).value
            this.$emit('statusChange', value)
        }
    }
}
</script>