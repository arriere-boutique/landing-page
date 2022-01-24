<template>
    <div class="Listing_container bg-bg-light" :class="{ 'is-init': isInit }">
        <div class="ListingContainer_title" v-if="title">
            {{ title }}
        </div>

        <div class="row-s">
            <div class="col-4" v-for="listing in listings" :key="listing._id"> 
                <a :href="listing.link" class="Listing">
                    <div class="Listing_image" :style="{ '--background': `url(${listing.images && listing.images[0] ? listing.images[0].small : '' })` }">

                    </div>

                    <p class="Listing_title ellipsis-2">{{ listing.title }}</p>
                    <!-- <p class="Listing_price">{{ (listing.price.amount / listing.price.divisor)|round }}€</p> -->
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ListingGridView',
    async fetch () {
        if (this.items.length > 0) {
            const response = await this.$store.dispatch('listings/fetch', { query: { _id: '$in' + this.items.join(',') } })
            this.listings = response
        }

        this.isInit = true
    },
    props: {
        title: { type: String },
        items: { type: Array, default: () => [] }
    },
    data: () => ({
        isInit: false,
        listings: []
    }),
    watch: {
        async items (v) {
            if (v.length > 0) {
                const response = await this.$store.dispatch('listings/fetch', { query: { _id: '$in' + v.join(',') } })
                this.listings = response
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .ListingContainer_title {
        font: var(--ft-m-medium);
        color: var(--color-ft);
        padding-bottom: 20px;
        margin-bottom: 30px;
        border-bottom: 1px solid var(--color-border);
    }
    .Listing_container {
        border-radius: 20px;
        padding: 20px 30px 0 30px;
    }

    .Listing {
        color: var(--color-ft);
        margin-bottom: 30px;
        transition: all 150ms ease;
        display: block;

        &:hover {
            transform: translateY(-2px);

            .Listing_image {

                &::before {
                    transition: all 1500ms ease-in-out;
                    transform: scale(1);
                }
            }
        }
    }

    .Listing_image {
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        position: relative;

        &::before {
            content: "";
            display: block;
            position: absolute;
            top: -10%;
            left: -10%;
            width: 120%;
            height: 120%;
            transform: scale(0.85);
            transition: all 500ms linear;
            background-image: var(--background);
            background-size: cover;
            background-position: center;
        }

        &::after {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
    }

    .Listing_title {
        margin-top: 10px;
        font: var(--ft-s-medium);
    }

    .Listing_price {
        margin-top: 5px;
        font: var(--ft-s);
    }
</style>