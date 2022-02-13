<template>
    <span>
        <i class="fas fa-star" v-for="star in rating" :key="star"></i>
    </span>
</template>

<script>
export default {
    name: 'Rating',
    props: {
        rating: { type: Number, default: 0 }
    }
}
</script>

<style>

</style>