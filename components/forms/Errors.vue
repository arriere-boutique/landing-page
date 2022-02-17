<template>
    <transition tag="div" name="fade">
        <div class="Errors ft-s-medium bg-gum-xweak pv-5 ph-20 br-m" v-show="errors.length > 0">
            <div class="mv-10" v-for="(error, i) in errors" :key="i">
                <i class="fal fa-times mr-5"></i> {{ error }}
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Errors',
    props: {
        items: { type: Array, default: () => [] },
        domain: { type: String, default: 'default' }
    },
    computed: {
        errors () {
            return this.items.map(item => {
                let errorText = this.$t(`errors.${this.domain}['${item.code ? item.code : item}']`)

                if (errorText == `errors.${this.domain}['${item.code ? item.code : item}']`) errorText = this.$t('errors.default.generic')

                return errorText
            })
        }
    }
}
</script>

<style>

</style>