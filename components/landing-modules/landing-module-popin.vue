<template>
    <popin-base :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
        <template slot="content">
            <form @submit.prevent="$emit('close'); $emit('submit')" class="p-40 p-30@s">
                <div class="p-30 bg-current-xweak br-m">
                    <div class="ft-l-bold color-current-strong mb-20">
                        <i class="fal mr-5" :class="[`fa-${metadata.fa}`]"></i> {{ metadata.title }}
                    </div>

                    <slot></slot>
                </div>

                <div class="bg-bg-light br-s b p-30 mt-20" v-if="value">
                    <div class="d-flex fx-align-center">
                        <div class="ft-l-medium color-ft mb-20">
                            <i class="fal fa-clock mr-5"></i> Programmation
                        </div>
                    </div>

                    <div class="row-s fx-align-center">
                        <div class="col-5 col-12@s mt-10@s">
                            <input-base
                                type="datetime-local"
                                label="Montrer à partir du"
                                :attrs="{ min: minStartDate, max: maxStartDate }"
                                :value="value.startDate"
                                @input="(v) => $emit('input', { startDate: v })"
                            />
                        </div>
                        <div class="col-5 col-12@s mt-10@s">
                            <input-base
                                type="datetime-local"
                                label="Cacher après le"
                                :attrs="{ min: minEndDate }"
                                :value="value.endDate"
                                @input="(v) => $emit('input', { endDate: v })"
                            />
                        </div>
                        <div class="col-2 col-12@s mt-10@s">
                            <link-base v-if="value.startDate || value.endDate" @click.native.stop="resetProgrammation">Supprimer</link-base>
                        </div>
                    </div>
                </div>

                <div class="d-flex fx-align-center mt-20">
                    <div class="fx-grow mr-20"></div>

                    <div>
                        <link-base @click="$emit('close'); $emit('reset')" class="mr-10">Annuler</link-base>

                        <button-base
                            :modifiers="['current']"
                            type="submit"
                        >
                            Appliquer
                        </button-base>
                    </div>
                </div>
            </form>
        </template>
    </popin-base>
</template>

<script>
import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    components: { InputBase, SelectBase, ToggleBase },
    props: {
        value: { type: Object, default: () => ({})  },
        metadata: { type: Object, default: () => ({}) },
        isActive: { type: Boolean, default: false }
    },
    computed: {
        minStartDate () {
            return this.$moment().format('yyyy-MM-DDThh:mm')
        },
        maxStartDate () {
            return this.value.endDate ? this.$moment(this.value.endDate).format('yyyy-MM-DDThh:mm') : false
        },
        minEndDate () {
            return (this.value.startDate ? this.$moment(this.value.startDate) : this.$moment()).format('yyyy-MM-DDThh:mm')
        }
    },
    methods: {
        resetProgrammation () {
            this.$emit('input', { startDate: null, endDate: null })
        }
    }
}
</script>

<style>

</style>