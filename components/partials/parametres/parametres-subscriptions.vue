<template>
    <div>
        <p class="ft-xl-medium">
            Mon abonnement
        </p>

        <div class="mt-20 p-20 bg-precious-xweak br-s max-width-m" v-if="subscription">
            <p class="ft-m-medium">
                Jusqu'au {{ $moment(subscription.expiration).format('D MMM YYYY') }}

                <span class="Tag Tag--s ml-5 is-precious">
                    Expire {{ $moment(subscription.expiration).fromNow() }}
                </span>    
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ParametresSubscriptions',
    data: () => ({

    }),
    computed: {  
        subscription () { return this.$store.state.user.subscription },
        shops () { return this.$store.state.shop.items },
    },
    async mounted () {
        console.log(this.subscription)
    },
    methods: {

    }
}
</script>

<style>

</style>