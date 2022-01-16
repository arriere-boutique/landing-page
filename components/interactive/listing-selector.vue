<template>
    <div class="ListingSelector">
        <div class="row-s">
            <div class="col-6">
                <p class="ft-s-medium mb-10">Tes fiches produit ({{ availableListings.length }})</p>
                <transition-group name="default" tag="div" class="p-relative">
                    <div class="ListingSelector_item" v-for="listing in availableListings" :key="listing._id" @click="() => select(listing._id)">
                        <img :src="listing.thumbnail ? listing.thumbnail : ''">

                        <div class="ListingSelector_content">
                            <p class="ellipsis-2">{{ listing.title }}</p>
                        </div>

                        <div class="ListingSelector_checkbox">
                            <input type="checkbox">
                        </div>
                    </div>
                </transition-group>
            </div>
                
            <div class="col-6">
                <p class="ft-s-medium mb-10">Fiches sélectionnées ({{ selectedListings.length }})</p>
                <transition-group name="default" tag="div" class="p-relative">
                    <div class="ListingSelector_item" v-for="listing in selectedListings" :key="listing._id" @click="() => deselect(listing._id)">
                        <img :src="listing.thumbnail ? listing.thumbnail : ''">

                        <div class="ListingSelector_content">
                            <p class="ellipsis-2">{{ listing.title }}</p>
                        </div>

                        <div class="ListingSelector_checkbox">
                            <input type="checkbox" :checked="true">
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ListingSelector',
    props: {
        value: { type: Array, default: () => [] }
    },
    computed: {
        listings () { return this.$store.getters['shop/allListings'] },
        selectedListings () { return this.listings.filter(l => this.value.includes(l._id)) },
        availableListings () { return this.listings.filter(l => !this.value.includes(l._id)) }
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
        border-radius: 10px;
        padding: 20px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg-xweak);
    }

    .ListingSelector_item {
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        margin-bottom: 5px;
        background-color: var(--color-bg-light);
        cursor: pointer;
        
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
        font: var(--ft-s);
    }

    .ListingSelector_checkbox {
        background: var(--color-pond-xweak);
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        width: 75px;
        flex-grow: 0;
        flex-shrink: 0;

        input {
            width: 15px;
            height: 15px;
        }
    }
</style>