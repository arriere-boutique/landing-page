<template>
    <popin-base
        :modifiers="['s', 'absolute-header']"
        :is-active="isActive"
        @close="$emit('close')"
    >
        <template slot="content">
            <div class="p-20">
                <p class="ft-m-bold mb-20">Créer un lien</p>

                <input-base
                    label="Lien"
                    v-model="formData.link"
                    :attrs="{
                        placeholder: 'https://antiswipe.lgbt'
                    }"
                />

                <input type="checkbox" v-model="blank"> Blank
            </div>
        </template>

        <template slot="footer">
            <div></div>

            <button-base
                :modifiers="['s']"
                @click="onSubmit"
            >
                Insérer le lien
            </button-base>
        </template>
    </popin-base>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'PopinLink',
    components: { InputBase },
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        blank: true,
        formData: {
            link: '',
            target: '_blank',
        }
    }),
    methods: {
        getForm () {
            return {
                ...this.formData,
                target: this.$data.blank ? '_blank' : '_self'
            }
        },
        onSubmit () {
            this.$emit('input', this.getForm())
            this.$emit('close')
        }
    }
}
</script>