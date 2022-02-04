<template>
    <div class="YoutubeVideo" v-if="id">
        <iframe :src="`https://www.youtube.com/embed/${id}`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ></iframe>
    </div>
</template>

<script>
export default {
    name: 'YoutubeVideo',
    props: {
        id: { type: String }
    }
}
</script>

<style lang="scss" scoped>
    .YoutubeVideo {
        position: relative;
        border-radius: 10px;
        overflow: hidden;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        &::before {
            content: "";
            display: block;
            padding-bottom: 56.5%;
        }
    }
</style>