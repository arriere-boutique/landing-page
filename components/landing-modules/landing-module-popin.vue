<template>
    <popin-base :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
        <template slot="content">
            <form @submit.prevent="$emit('close'); $emit('submit')" class="p-40 p-20@s">
                <div class="p-30 bg-current-xweak br-m p-20@s ft-m-medium@m">
                    <div class="ft-l-bold color-current-strong mb-20">
                        <i class="fal mr-5" :class="[`fa-${metadata.fa}`]"></i> {{ metadata.title }}
                    </div>

                    <slot></slot>
                </div>

                <div class="bg-bg-light br-s b p-30 mt-20 p-20@s" v-if="value">
                    <div class="fx-center">
                        <div class="ft-l-medium color-ft ft-m-medium@m">
                            <i class="fal fa-clock mr-5"></i> Programmation
                        </div>

                        <toggle-base v-model="hasProgrammation" />
                    </div>

                    <div class="row-s fx-align-center mt-20" v-show="hasProgrammation">
                        <div class="col-6 col-12@s mt-10@s">
                            <input-base
                                type="datetime-local"
                                label="Montrer à partir du"
                                :attrs="{ min: minStartDate, max: maxStartDate }"
                                :value="value.startDate"
                                @input="(v) => $emit('input', { startDate: v })"
                            />
                        </div>
                        <div class="col-6 col-12@s mt-10@s">
                            <input-base
                                type="datetime-local"
                                label="Cacher après le"
                                :attrs="{ min: minEndDate }"
                                :value="value.endDate"
                                @input="(v) => $emit('input', { endDate: v })"
                            />
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
    data: () => ({
        hasProgrammation: false
    }),
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
    watch: {
        hasProgrammation (v) {
            if (!v) this.resetProgrammation()
        }
    },
    mounted () {
        if (this.value.startDate || this.value.endDate) this.hasProgrammation = true
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