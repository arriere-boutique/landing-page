<template>
    <popin-base :is-active="isActive" :modifiers="['panel']" @close="$emit('close')">
        <template slot="content">
            <form @submit.prevent="$emit('close'); $emit('submit')" class="p-60">
                <slot></slot>

                <hr class="Separator mv-40" />

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
export default {
    props: {
        isActive: { type: Boolean, default: false }
    }
}
</script>

<style>

</style>