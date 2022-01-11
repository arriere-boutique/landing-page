<template>
    <div>
        <div class="Wrapper Wrapper--left">
            <p class="ft-2xl-bold mv-40">Outils</p>

            <p class="ft-xl-bold mv-40">Générateur de tags</p>

            <form @submit.prevent="() => generate()" class="row-xs">
                <div class="col-6">
                    <div class="b p-20 br-m">
                        <input-base type="text" label="Que veux-tu vendre ?" v-model="search" :attrs="{ required: true }" />

                        <transition-group tag="div" class="mt-20" name="tag">
                            <div class="ShopTag ShopTag--ice m-3" v-for="tag in saved" :key="tag">
                                <span>
                                    <i class="fal fa-magnifying-glass" @click="generate(tag)"></i>

                                    {{ tag }}

                                    <i class="fal fa-times ml-10"  @click="removeTag(tag)"></i>
                                </span>
                            </div>
                        </transition-group>
                    </div>
                </div>
                <div class="col-6">
                    <div class="bg-precious-xweak p-20 br-m text-center">
                        <div>
                            <transition-group tag="div" name="tag">
                                <div class="ShopTag m-3" :class="{ 'is-loading': isLoading }" v-for="tag in displayedTags.filter(r => r.visible)" :key="tag.order">
                                    <span>
                                        <i class="fal fa-plus" @click="save(tag.value, tag.order)" v-if="!saved.includes(tag.value)"></i>

                                        {{ tag.value }} ({{ tag.score }})

                                        <!-- <a v-for="(info, i) in tag.info" :href="info.url" :key="i">{{ i }}</a> -->
                                    </span>
                                </div>
                            </transition-group>

                            <hr class="Separator mv-10">

                            <button-base :modifiers="['secondary', 's']" :class="{ 'is-loading': isLoading }" icon-before="arrows-rotate" type="submit">
                                Générer
                            </button-base>
                        </div>
                    </div>

                    <div class="b mt-10 p-20 br-m text-center" v-if="excluded.length > 0">
                        <div class="ShopTag ShopTag--weak m-3 is-weak" v-for="tag in excluded" @click="toggleTag(tag)" :key="tag">
                            <span>{{ tag }}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import StringSimilarity from 'string-similarity'

const BLACKLIST = [ '&quot;', 'avec', 'faites', 'fait', 'main', 'elle', 'pour', 'sur', 'dans', 'fait main', 'une', 'for', 'one' ]

export default {
    name: 'DashboardTools',
    middleware: 'loggedUser',
    layout: 'dashboard',
    components: { InputBase },
    data: () => ({
        isLoading: false,
        lastSearch: '',
        search: '',
        offset: 0,
        totalResults: 0,
        totalFilteredResults: 0,
        saved: [],
        excluded: [],
        results: [],
        allTags: [],
        displayedTags: []
    }),
    computed: {
        allExclusions () {
            return [ ...this.saved, ...this.excluded ]
        }
    },
    methods: {
        save (tag, replace) {
            this.saved.push(tag)

            let newTag = { ...this.getNextTag(), order: replace }
            if (newTag && !this.allExclusions.includes(newTag.value)) this.displayedTags = this.displayedTags.map(t => t.order == newTag.order ? newTag : t)
        },
        removeTag (tag) {
            this.saved = this.saved.filter(t => t != tag)
        },
        toggleTag (tag) {
            this.excluded.includes(tag) ? this.excluded.filter(t => t != tag) : this.excluded.push(tag) 
        },
        getNextTag () {
            let tag = this.allTags[0] ? this.allTags[0] : null
            if (this.allTags.length > 0) this.allTags = this.allTags.slice(1)

            return tag
        },
        async generate (search) {
            if (this.isLoading) return
            
            this.excluded = [ ...this.excluded, ...this.displayedTags.map(t => t.value) ]

            if (search) this.search = search
            this.offset = this.lastSearch == this.search ? this.offset + 30 : 0

            this.isLoading = true
            this.lastSearch = this.search

            let response = await this.$store.dispatch('etsy/similarTags', {
                keywords: this.search,
                offset: this.offset,
                samples: 2,
                limit: 50
            })

            if (response) {
                this.results = response
                this.orderTags()
            }
            
            this.isLoading = false
        },
        orderTags () {
            let results = []
            let shops = []

            let allTags = this.results.reduce((total, r) => {
                if (!shops.includes(r.user_id)) {
                    shops.push(r.user_id)

                    let titles = r.title.split(/[.\-,|]/)
                    if (titles.length == 1) titles = r.title.split(' ')

                    let info = {
                        listing: r.listing_id,
                        url: r.url
                    }

                    return [ ...total, ...r.tags.map(t => ({ value: t.toLowerCase(), info })), ...titles.map(t => ({ value: t.toLowerCase(), info })) ]
                } else {
                    return total
                }
            }, []).filter(result => !(result.value.length <= 2 || result.value.length >= 20 || BLACKLIST.includes(result.value)))

            allTags.forEach(tag => {
                let added = false

                results.forEach(result => {
                    if (StringSimilarity.compareTwoStrings(tag.value, result.value) > 0.85) {
                        results = results.map(r => {
                            let update = r.value == result.value && result.listing != tag.info.listing

                            return update ? {
                                ...r, score: r.score + 1, info: [ ...r.info, tag.info ]
                            } : r
                        })

                        added = true
                    }
                })

                if (!added) results.push({ value: tag.value, listing: tag.info.listing, id: Math.random(), score: tag.value.includes(' ') ? 1 : 0, info: [ tag.info ] })
            })
        
            results = results.map(result => {
                let visible = true

                if (result.score <= 0) {
                    return { ...result, visible: false }
                }

                [ ...this.allExclusions, this.search ].forEach(s => {
                    if (StringSimilarity.compareTwoStrings(result.value, s) > 0.85) visible = false
                })

                return { ...result, visible }
            })

            results = results.filter(r => r.visible)
            results = results.sort((a, b) => b.score - a.score)
            
            this.allTags = results.sort((a, b) => b.score - a.score).slice(6)
            results = results.slice(0, 6)
            this.displayedTags = this.$shuffle(results.map((r, i) => ({ ...r, order: i })))
        }
    }
}
</script>

<style lang="scss" scoped>
    .ShopTag {
        transition: all ease-in-out 300ms;
        background: var(--color-bg-light);
        border-radius: 30px;
        display: inline-block;
        font: var(--ft-s-medium);
        position: relative;
        transition: all 150ms ease-in-out;
        
        span {
            display: flex;
            align-items: center;
            height: 42px;
            padding: 0 15px 0 0;
            transition: all 150ms ease-in-out;

            i {
                height: 36px;
                width: 36px;
                margin: 0 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 50%;

                &:hover {
                    background-color: var(--color-bg-xweak);
                }
            }
        }

        &::after {
            content: "\f3f4";
            display: block;
            font-family: "Font Awesome 6 Pro";
            opacity: 0;
            transform: translate3d(-50%, -50%, 0) scale(0.8);
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 16px;
            pointer-events: none;
            transition: all 150ms ease-in-out;
        }
    }

    .ShopTag--ice {
        background-color: var(--color-ice-xweak);

        span {

            i:hover {
                background-color: var(--color-bg-light);
            }
        }
    }

    .ShopTag.is-loading {
        pointer-events: none;

        span {
            transform: scale(0.95);
            opacity: 0.2;
            filter: blur(1px);
        }
        &::after {
            opacity: 0.75;
            transform: translate3d(-50%, -50%, 0) scale(1);
            animation: baseSpin 1000ms cubic-bezier(0.39, 0.32, 0.18, 0.87) 0s infinite;
        }
    }

    .ShopTag.is-weak {
        opacity: 0.5;
    }

    @keyframes baseSpin {
        0% {
            transform: translate3d(-50%, -50%, 0) rotate(0deg);
        }

        100% {
            transform: translate3d(-50%, -50%, 0) rotate(360deg);
        }
    }

    .tag-leave-active {
        position: absolute;
        transition: all ease-in-out 300ms;
    }
    
    .tag-leave-to {
        opacity: 0;
    }
    .tag-move {
        transition: all ease-in-out 300ms;
    }

</style>