<template>
    <popin-base :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
        <template slot="content">
            <form @submit.prevent="$emit('close'); $emit('submit')" class="p-40 m-40 bg-current-xweak br-m">
                <div class="ft-l-bold color-current-strong mb-20">
                    <i class="fal mr-5" :class="[`fa-${fa}`]"></i> {{ title }}
                </div>

                <slot></slot>

                <div class="bg-bg-light br-s p-20 mt-20" v-if="value">
                    <div class="ft-m-medium color-current-strong mb-20">
                        <i class="fal fa-clock mr-5"></i> Programmation
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <input-base
                                type="datetime-local"
                                label="Montrer à partir du"
                                :value="value.startDate"
                                @input="(v) => update({ startDate: v })"
                            />
                        </div>
                        <div>
                            <input-base
                                type="datetime-local"
                                label="Cacher après le"
                                :value="value.endDate"
                                @input="(v) => update({ endDate: v })"
                            />
                        </div>
                    </div>
                </div>

                <div class="d-flex fx-align-center">
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
        value: { type: Object },
        title: { type: String },
        fa: { type: String },
        isActive: { type: Boolean, default: false }
    },
    methods: {
        update (data) {
            console.log(data)

            this.$emit('input', {
                ...this.value,
                ...data
            })
        }
    }
}
</script>

<style>

</style>