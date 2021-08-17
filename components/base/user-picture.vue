<template>
    <div class="UserPicture" :style="{ '--image': `url(${image})` }">
        <div class="UserPicture_image">
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserPicture',
    props: {
        image: { type: String, default: '' }
    }
}
</script>