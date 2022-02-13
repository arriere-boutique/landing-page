<template>
    <form @submit.prevent="() => search(query)" class="PexelsGallery">
        <div class="PexelsGallery_search p-20" :style="{ '--background': `url(${random.src ? random.src.large : ''})` }">
            <div>
                <input-base type="text" class="mr-10" :modifiers="['no-label']" v-model="query" :attrs="{ placeholder: 'Nature, art abstrait, atelier...' }" />
                <button-base type="submit" :modifiers="['secondary', 's', 'white']" :class="{ 'is-loading': isLoading }" class="mt-10@s">
                    Rechercher
                </button-base>
            </div>
        </div>

        <div class="p-30">
            <div ref="container">
                <div class="PexelsGallery_row" v-for="(row, i) in displayedRows" :key="i">
                    <div class="PexelsGallery_photo" v-for="photo in row.photos" :key="photo.id" :style="{ '--width': photo.width + 'px', '--height': photo.height + 'px' }" @click="$emit('select', photo.original)">
                        <img :src="photo.original.src.medium" :width="Math.min(photo.original.width * 0.8, photo.width)" :height="Math.min(photo.original.height * 0.8, photo.height)" />
                    </div>
                </div>

                <div class="text-center mt-20">
                    <button-base type="button" :modifiers="['secondary', 's']" :class="{ 'is-loading': isLoading }" icon-before="arrows-rotate" @click="getNext">
                        Afficher d'autres
                    </button-base>
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
        prevQuery: '',
        isLoading: false,
        photos: [],
        rows: [],
        offset: 0,
        maxWidth: 0,
        random: {}
    }),
    props: {
        height: { type: Number, default: 150 },
        maxRows: { type: [Number, Boolean], default: 1 },
        maxPhotos: { type: [Number, Boolean], default: false }
    },
    computed: {
        displayedRows () {
            return this.rows.slice(0, this.maxRows)
        }
    },  
    mounted () {
        this.$data.maxWidth = this.$refs.container.offsetWidth
        this.search()
    },
    methods: {
        getNext () {
            if (this.rows.length > 2) {
                this.rows = this.rows.slice(2)
            } else {
                this.search(this.query)
            }
        },
        async search (v = null) {
            this.isLoading = true

            try {

                if (this.query == this.prevQuery) this.offset += 1
                this.prevQuery = this.query

                let params = {
                    query: { per_page: 100, page: this.offset }
                }

                if (v) params.query = { ...params.query, query: v }

                let response = await this.$store.dispatch('pexels/fetch', params)

                this.photos = response
                this.rows = this.arrangePhotos(this.photos)

                this.random = this.photos[this.$randomBetween(0, this.photos.length - 1)]
            } catch (e) {

            }
            
            this.isLoading = false
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

            return rows.filter(r => r.photos.length > 0)
        }
    }
}
</script>

<style lang="scss" scoped>
    .PexelsGallery {
        border: 2px solid var(--color-onyx);
        border-radius: 10px;
        overflow: hidden;
    }

    .PexelsGallery_search {
        border-bottom: 2px solid var(--color-onyx);
        position: relative;
        background-color: var(--color-onyx);
        overflow: hidden;

        &::before {
            content: "";
            position: absolute;
            top: -5%;
            left: -5%;
            width: 110%;
            height: 110%;
            background-size: cover;
            background-position: center;
            background-image: var(--background);
            opacity: 0.3;
            filter: blur(2px);
        }

        & > div {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
        }
    }

    .PexelsGallery_row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 5px;
        justify-content: center;
    }

    .PexelsGallery_photo {
        margin-right: 5px;
        width: var(--width);
        height: var(--height);
        border-radius: 4px;
        cursor: pointer;
        transition: all 150ms ease;
        overflow: hidden;

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

    @include breakpoint-s {

        .PexelsGallery_search {

            & > div {
                display: block;
                text-align: center;
            }
        }
    }
</style>