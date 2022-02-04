<template>
    <div class="ListingSelector">
        <p class="ft-s-medium mb-10">Tes fiches produit ({{ availableListings.length }})</p>
        <transition-group name="fade" tag="div" class="ListingSelector_container row-xs p-relative">
            <div class="col-6 mb-5 col-12@s" v-for="listing in showingListings" :key="listing._id">
                <div class="ListingSelector_item">
                    <img :src="listing.thumbnail ? listing.thumbnail : ''">

                    <div class="ListingSelector_content">
                        <p class="ellipsis-2">{{ listing.title }}</p>
                    </div>

                    <div class="ListingSelector_checkbox">
                        <button-base icon-before="plus" type="button" :modifiers="['light', 'round', '2xs']" @click="select(listing._id)" />
                    </div>
                </div>
            </div>
        </transition-group>

        <div class="mt-5 d-flex fx-justify-end fx-align-center">
            <button-base icon-before="angle-left" type="button" :modifiers="['light', 'round', 'xs']" @click="offset -= limit" v-show="this.offset > 0" />

            <p class="ft-xs-medium mh-10">{{ (this.offset / this.limit) + 1 }} / {{ this.maxPages }}</p>

            <button-base icon-after="angle-right" type="button" :modifiers="['light', 'xs']" :class="{ 'is-disabled': this.offset >= this.maxPages - 1 }" @click.native.prevent="offset += limit">Page suivante</button-base>
        </div>

        <div v-if="selectedListings.length > 0" class="mt-30@s">
            <p class="ft-s-medium mb-10">Fiches sélectionnées ({{ selectedListings.length }})</p>
            <transition-group name="default" tag="div" class="p-relative">
                <div class="ListingSelector_item mb-5" v-for="listing in selectedListings" :key="listing._id">
                    <img :src="listing.thumbnail ? listing.thumbnail : ''">

                    <div class="ListingSelector_content">
                        <p class="ellipsis-2">{{ listing.title }}</p>
                    </div>

                    <div class="ListingSelector_checkbox">
                        <button-base icon-before="minus" type="button" :modifiers="['light', 'round', '2xs']" @click="deselect(listing._id)" />
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ListingSelector',
    props: {
        value: { type: Array, default: () => [] }
    },
    data: () => ({
        offset: 0,
        limit: 6
    }),
    computed: {
        listings () { return this.$store.getters['shop/allListings'] },
        selectedListings () { return this.listings.filter(l => this.value.includes(l._id)) },
        availableListings () { return this.listings.filter(l => !this.value.includes(l._id)) },
        showingListings () {
            return this.availableListings.slice(this.offset, this.offset + this.limit)
        },
        maxPages () {
            return Math.ceil(this.availableListings.length / this.limit)
        }
    },
    methods: {
        deselect (_id) {
            this.$emit('input', this.value.filter(v => v != _id))
        },
        select (_id) {
            this.$emit('input', [ ...this.value, _id ])
        }
    }
}
</script>

<style lang="scss" scoped>
    .ListingSelector {
    }

    .ListingSelector_item {
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        background-color: var(--color-bg-light);
        cursor: pointer;
        overflow: hidden;
        
        img {
            border-radius: 8px;
            width: 50px;
            height: 50px;
            display: block;
            margin: 10px;
        }
    }

    .ListingSelector_content {
        flex-grow: 1;
        color: var(--color-ft);
        word-break: break-all;
        font: var(--ft-s);
    }

    .ListingSelector_checkbox {
        background: var(--color-bg-xweak);
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        width: 50px;
        margin-left: 10px;
        flex-grow: 0;
        flex-shrink: 0;
    }
</style>