<template>
    <popin-base
        :modifiers="['s', 'absolute-header']"
        :is-active="isActive"
        @close="$emit('close')"
    >
        <template slot="content">
            <div class="p-20">
                <p class="ft-m-bold mb-20">Insérer une vidéo youtube</p>

                <input-base
                    label="ID de la vidéo"
                    v-model="formData.src"
                    :attrs="{
                        placeholder: 'DjSGmh4-sHc'
                    }"
                />
            </div>
        </template>

        <template slot="footer">
            <div></div>

            <button-base
                :modifiers="['s']"
                @click="$emit('input', getForm())"
            >
                Insérer le lien
            </button-base>
        </template>
    </popin-base>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'PopinYoutube',
    components: { InputBase },
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        formData: {
            src: ''
        }
    }),
    methods: {
        getForm () {
            return {
                ...this.formData
            }
        }
    }
}
</script>