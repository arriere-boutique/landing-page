<template>
    <div class="GalleryMosaic" :class="{ 'is-no-selection': selected.length <= 0 }">
        <div class="GalleryMosaic_row" v-for="(row, i) in imageRows" :key="i">
            <div
                v-for="image in row.images"
                class="GalleryMosaic_imageContainer ActionMenu_hover" 
                :class="{ 'is-active': selected.find(i => image.collection._id == i._id ) }"
                :style="{ '--width': image.width + 'px', '--height': image.height + 'px' }"
                :key="image._id"
                @click="$emit(selected.find(i => image.collection._id == i._id ) ? 'deselect' : 'select', image.collection)"
            >
                <img class="GalleryMosaic_image" :width="Math.min(image.original.width * 0.8, image.width)" :height="Math.min(image.original.height * 0.8, image.height)" :src="image.src" />

                <div class="GalleryMosaic_selector" v-if="selector">
                    <i class="fal fa-check"></i>
                </div>

                <div class="GalleryMosaic_overlay" :class="{ 'is-active': state.active == image._id }">
                    
                </div>

                <action-menu
                    :sub-items="[
                        { label: 'Supprimer', icon: 'times', onClick: () => $emit('delete', image.collection._id) }
                    ]"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GalleryMosaic',
    props: {
        items: { type: Array, default: () => [] },
        height: { type: Number, default: 175 },
        selector: { type: Boolean, default: false },
        selected: { type: Array, default: () => [] }
    },
    data: () => ({
        state: {
            active: 1
        },
        maxWidth: 0
    }),
    mounted () {
        this.$data.maxWidth = this.$el.offsetWidth
    },
    computed: {
        imageRows () {
            let images = this.$props.items.slice()
            
            let rows = []
            let safeguard = 0

            while (images.length > 0 && safeguard < 100) {
                safeguard++

                let currentRow = {
                    width: 0,
                    images: []
                }

                while (currentRow.width < this.$data.maxWidth && images.length > 0 && safeguard < 100) {
                    safeguard++
                    
                    let current = images[0].sizes['s']
                    let width = (this.$props.height / current.height) * current.width

                    currentRow.images.push({
                        ...current,
                        collection: images[0],
                        original: current,
                        width: width,
                        height: this.$props.height
                    })

                    currentRow.width += width
                    images.shift()
                }

                rows.push(currentRow)
            }

            rows.forEach((row, i) => {
                if (i == rows.length - 1 && (row.width - 5) < this.$data.maxWidth) return

                let diff = this.$data.maxWidth / (row.width - 5)

                row.images = row.images.map(image => ({
                    ...image,
                    width: Math.round(image.width * diff) - 5,
                    height: Math.round(image.height * diff) - 5
                }))
            })

            return rows
        }
    }
}
</script>