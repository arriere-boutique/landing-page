<template>
    <div>
        <div class="Wrapper p-relative pb-100">
            <div class="row-s fx-nowrap">
                <div class="col-grow">

                    <div class="pv-100"></div>
                    <div class="pv-100"></div>
                </div>
                <div class="col-no-shrink width-xs">
                    <div class="p-15">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {} from '@/utils/base'

export default {
    name: 'DashboardPage',
    layout: 'admin',
    async fetch () {

    },
    computed: {
        user () { return this.$store.state.auth.user }
    },
    mounted () {

    },
    head () {
        let meta = {
            title: 'Tableau de bord',
            secondary: `Hello.`
        }

        this.$store.commit('page/setProperty', meta)

        return meta
    }
}
</script>