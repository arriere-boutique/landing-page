<template>
    <div class="GalleryCompact" ref="container">
        <div class="GalleryCompact_rail">
            <div
                class="GalleryCompact_item"
                v-for="(image, i) in images"
                :style="{
                    width: (image.currentWidth ? image.currentWidth : image.width) + 'px',
                    height: (image.currentHeight ? image.currentHeight : image.height) + 'px'
                }"
                :key="i"
            >
                <img :src="image.src" :width="image.width" :height="image.height" :alt="image.alt" :title="image.title">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GalleryCompact',
    props: {
        node: { type: Object, default: null },
    },
    data: () => ({
        images: []
    }),
    watch: {
        node () {
            this.updateBounds()
        }
    },
    mounted () {
        this.updateBounds()
    },
    methods: {
        updateBounds () {
            let images = this.$props.node.attrs.medias.map(media => ({
                title: media.title,
                alt: media.alt,
                source: media.source,
                link: media.sourceLink,
                ...media.sizes.m
            }))
            
            this.$data.images = images

            if (!this.$refs.container) return

            this.$nextTick(() => {
                let bounds = JSON.parse(JSON.stringify(this.$refs.container.getBoundingClientRect()))
                let imagesWidth = 0

                images = images.map(image => {
                    let heightModifier = bounds.height / image.height
                    imagesWidth += image.width * heightModifier

                    return {
                        ...image,
                        currentWidth: image.width * heightModifier,
                        currentHeight: image.height * heightModifier
                    }
                })

                let widthModifier = Math.max(600, bounds.width) / imagesWidth

                this.$data.images = images.map(image => ({
                    ...image,
                    currentHeight: image.currentHeight * widthModifier,
                    currentWidth: image.currentWidth * widthModifier
                }))
            })
        }
    }
}
</script>