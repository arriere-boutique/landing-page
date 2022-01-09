<template>
    <div class="UserPage">
        <form @submit.prevent="onSubmit" class="Page_content Wrapper--xs">
            <div class="fx-grow pb-100">
                <div class="Block p-20">
                    <p class="Title mb-20">Informations personnelles</p>

                    <input-base
                        type="text"
                        label="Ton prénom"
                        class="mv-10"
                        :attrs="{ required: true }"
                        v-model="form.name"
                    />

                    <div class="d-flex fx-justify-end mt-20">
                        <button-base :modifiers="['s']" :attrs="{ type: 'submit' }">
                            Enregistrer
                        </button-base>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import {} from '@/utils/base'

export default {
    name: 'UserPage',
    components: { InputBase },
    layout: 'admin',
    data: () => ({
        form: {
            name: '',
            theme: {
                color: 'gum',
                icon: 'cat-space'
            }
        }
    }),
    computed: {
        user () { return this.$store.state.user.info },
        savedUser () { return this.$store.state.auth.user }
    },
    watch: {
        savedUser: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.form = {
                    name: v.name ? v.name : '',
                    theme: v.theme ? v.theme : {
                        color: 'gum',
                        icon: 'cat-space'
                    }
                }
            }
        },
        form: {
            deep: true,
            handler (v) {
                this.$store.commit('user/preview', v)
            }
        }
    },
    methods: {
        async onSubmit () {
            const response = await this.$store.dispatch('user/update', {
                _id: this.user._id,
                params: this.$data.form,
            })

            this.$store.commit('utils/addFlash', {
                type: response.status == 1 ? 'success' : 'error'
            })
        }
    },
    beforeDestroy () {
        this.$store.commit('user/preview', this.savedUser)
    },
    head () {
        let meta = {
            title: 'Mes paramètres'
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>