<template>
    <form @submit.prevent="() => search(query)" class="PexelsGallery">
        <input-base type="text" label="Rechercher" v-model="query" />

        <div class="" ref="container">
            <div class="PexelsGallery_row" v-for="(row, i) in photos" :key="i">
                <div class="PexelsGallery_photo" v-for="photo in row.photos" :key="photo.id" :style="{ '--width': photo.width + 'px', '--height': photo.height + 'px' }" @click="$emit('select', photo.original)">
                    <img :src="photo.original.src.medium" :width="Math.min(photo.original.width * 0.8, photo.width)" :height="Math.min(photo.original.height * 0.8, photo.height)" />
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'PexelsGallery',
    components: { InputBase },
    data: () => ({
        query: '',
        photos: [],
        maxWidth: 0
    }),
    props: {
        height: { type: Number, default: 150 }
    },
    mounted () {
        this.$data.maxWidth = this.$refs.container.offsetWidth
        this.search()
    },
    methods: {
        async search (v = null) {
            let params = {
                query: { per_page: 10, orientation: 'portrait' }
            }

            if (v) params.query = { ...params.query, query: v }

            let response = await this.$store.dispatch('pexels/fetch', params)

            this.photos = this.arrangePhotos(response)
        },
        arrangePhotos (items) {
            let photos = items.slice()
            
            let rows = []
            let safeguard = 0

            while (photos.length > 0 && safeguard < 100) {
                safeguard++

                let currentRow = {
                    width: 0,
                    photos: []
                }

                while (currentRow.width < this.maxWidth && photos.length > 0 && safeguard < 100) {
                    safeguard++
                    
                    let current = photos[0]
                    let width = (this.height / current.height) * current.width

                    currentRow.photos.push({
                        ...current,
                        id: current.id,
                        original: current,
                        width: width,
                        height: this.$props.height
                    })

                    currentRow.width += width
                    photos.shift()
                }

                rows.push(currentRow)
            }

            rows.forEach((row, i) => {
                if (i == rows.length - 1 && (row.width - 5) < this.maxWidth) return

                let diff = this.maxWidth / (row.width - 5)

                row.photos = row.photos.map(photo => ({
                    ...photo,
                    width: Math.round(photo.width * diff) - 5,
                    height: Math.round(photo.height * diff) - 5
                }))
            })

            return rows
        }
    }
}
</script>

<style lang="scss" scoped>
    .PexelsGallery {
        border: 1px solid var(--color-onyx);
        padding: 20px;
        border-radius: 10px;
    }

    .PexelsGallery_row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 5px;
    }

    .PexelsGallery_photo {
        margin-right: 5px;
        width: var(--width);
        height: var(--height);
        cursor: pointer;
        transition: all 150ms ease;

        &:active {
            opacity: 0.5;
            transform: scale(0.95);
        }

        &:hover {
            opacity: 0.75;
            transform: scale(0.98);
        }

        &:last-child {
            margin-right: 0;
        }

        img {
            display: block;
        }
    }
</style>