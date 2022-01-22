<template>
    <div class="Module Tile p-20" :class="[ `is-${color}`, { 'is-dev': dev } ]" >
        <div class="d-flex fx-align-center">
            <p class="ft-l color-current-strong fx-grow">
                <i class="fal" :class="[ `fa-${fa}` ]"></i>
            </p>

            <div class="round-s bg-bg-light" v-if="hasHequirements">
                <tooltip class="color-current" icon="triangle-exclamation" :text="requirementList"  />
            </div>

            <i class="fal fa-spinner-third color-current spin" v-if="dev"></i>
        </div>

        <div class="Module_titles mt-30">
            <p class="ft-l-bold color-current-strong">{{ title }}</p>
            <p class="ft-s-medium mt-5">{{ description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModuleTile',
    props: {
        title: { type: String },
        color: { type: String },
        fa: { type: String },
        description: { type: String },
        dev: { type: Boolean, default: false },
        hasHequirements: { type: [Array, Boolean], default: false }
    },
    computed: {
        requirementList () {
            return this.hasHequirements ? `Pour fonctionner, ce bloc nécessite ` + this.hasHequirements.map(m => this.$t(`modules.requirements.${m}`)).join(',') : ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .Module {
        cursor: pointer;

        &.is-dev {
            background-color: var(--bg-bg-light);
            border: 1px solid var(--color-current);

            .Module_titles > * {
                color: var(--color-ft-weak);
            }
        }
    }
    
</style>