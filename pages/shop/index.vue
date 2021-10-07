<template>
    <div class="ShopPage">
        <div class="pv-100"></div>
    </div>
</template>

<script>
export default {
    name: 'ShopPage',
    head () {
        let meta = {
            title: '',
            meta: [
                { hid: 'description', name: 'description', content: '' }
            ]
        }

        this.$store.commit('page/setColor', 'skylight')

        return meta
    }
}
</script>