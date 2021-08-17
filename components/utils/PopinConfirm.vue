<template>
    <popin-base
        :modifiers="['xs', 'no-header']"
        :is-active="open"
    >  
        <template slot="content">
            <div class="p-20 text-center" v-if="popin">
                {{ popin.text ? popin.text : `Voulez-vous vraiment effectuer cette action ?` }}
            </div>
        </template>

        <template slot="footerLeft">
            <button-base v-bind="cancel" @click="cancel.callback" v-if="popin" />
        </template>

        <template slot="footerRight">
            <button-base v-bind="confirm" @click="confirm.callback" v-if="popin" />
        </template>
    </popin-base>
</template>

<script>
export default {
    name: 'PopinConfirm',
    data: () => ({
        open: false
    }),
    computed: {
        popin () {
            return this.$store.state.utils.confirmPopin
        },
        confirm () {
            return {
                text: 'Confirmer',
                modifiers: ['s'],
                ...(this.popin.confirm ? this.popin.confirm : {}),
                callback: () => {
                   if (this.popin.confirm && this.popin.confirm.callback) this.popin.confirm.callback()
                   this.onClose()
                }
            }
        },
        cancel () {
            return {
                text: 'Annuler',
                modifiers: ['s', 'weak'],
                ...(this.popin.cancel ? this.popin.cancel : {}),
                callback: () => {
                   if (this.popin.cancel && this.popin.cancel.callback) this.popin.cancel.callback()
                   this.onClose()
                }
            }
        }
    },
    watch: {
        popin (v) {
            this.$data.open = v ? true : false
        }
    },
    methods: {
        onClose (id) {
            this.$data.open = false
            setTimeout(() => this.$store.commit('utils/closeConfirm'), 300)
        }
    }
}
</script>
