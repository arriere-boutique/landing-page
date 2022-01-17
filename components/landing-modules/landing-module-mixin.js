import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    components: { InputBase, SelectBase, ToggleBase },
    props: {
        module: { type: Object, default: () => ({}) },
        moduleCount: { type: Number, default: 0 },
        order: { type: Number, default: 0 }
    },
    data: () => ({
        isActive: false,
        formData: {}
    }),
    watch: {
        module: {
            immediate: true,
            handler (v) {
                if (JSON.stringify(this.formData) == JSON.stringify(v)) return
                this.formData = { ...v }
            }
        }
    },
    computed: {
        $modifiers () {
            let modifiers = {}

            if (this.$props.modifiers) {
                this.$props.modifiers.forEach(modifier => { 
                    if (modifier) {
                        modifiers[this.$options.name + '--' + modifier] = true
                    }
                })
            }

            return modifiers
        }
    },
    methods: {
        toggle (v = {}) {
            this.$emit('input', { ...this.formData, active: !this.formData.active })
        },
        changePosition (position) {
            this.$emit('input', { ...this.formData, position })
        },
        reset () {
            this.formData = { ...this.module }
        },
        submit () {
            this.$emit('input', this.formData)
        }
    }
}