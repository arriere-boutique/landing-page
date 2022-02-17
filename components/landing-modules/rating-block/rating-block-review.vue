<template>
  <div>
      <div class="mb-20 ft-s">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
        </div>

        <p class="ft-m" v-html="comment"></p>
        
        <div class="fx-center  mt-10">
            <p class="ft-s-bold">{{ user.name }} <span class="ft-s ft-italic color-ft-weak">via Etsy</span></p>

            <p class="c-pointer" @click="$emit('next')"><i class="fal fa-long-arrow-down"></i></p>
        </div>
  </div>
</template>

<script>
export default {
    name: 'Review',
    props: {
        comment: { type: String },
        user: { type: Object }
    }
}
</script>

<style>

</style>