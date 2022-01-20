import { InputBase, SelectBase, ToggleBase } from 'instant-coffee-core'

export default {
    components: { InputBase, SelectBase, ToggleBase },
    props: {
        module: { type: Object, default: () => ({}) },
        modules: { type: Array, default: () => [] }
    },
    data: () => ({
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
    methods: {
        delete () {
            this.$emit('delete')
        },
        toggle (v) {
            this.$emit('input', {
                ...this.formData,
                active: v,
                startDate: null,
                endDate: null
            })
        },
        changePosition (position) {
            this.$emit('input', { ...this.formData, position })
        },
        reset () {
            this.formData = { ...this.module }
        },
        input (data) {
            this.formData = { ...this.formData, ...data }
        },
        submit () {
            this.$emit('input', this.formData)
        }
    }
}