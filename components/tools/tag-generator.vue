<template>
    <div>
        <form @submit.prevent="() => generate()" class="row-s">
            <div class="col-6 col-12@s">
                <div class="b br-m o-hidden">
                    <div class="p-30">
                        <input-base type="text" label="Que veux-tu vendre ?" v-model="search" :attrs="{ required: true }" />
                    </div>

                    <div class="bg-bg-xweak p-15 ph-20" v-if="saved.length > 0">
                        <div class="d-flex fx-align-center fx-wrap mb-10">
                            <div class="ft-s-medium fx-grow">
                                <span class="round-s bg-bg-light mr-3">{{ saved.length }}</span> Mots-clés sélectionnés 
                            </div>

                            <link-base @click="$copy(saved.join(', '))">Tout copier</link-base>
                        </div>
                        
                        <transition-group tag="div" name="tag">
                            <div class="ShopTag mv-5 mh-3" v-for="tag in saved" @click="$copy(tag)" :key="tag">
                                <span>
                                    <i class="fal fa-magnifying-glass" @click.stop="generate(tag)"></i>

                                    <span>{{ tag }}</span>
                                    
                                    <i class="fal fa-times ml-10" @click.stop="removeTag(tag)"></i>
                                </span>
                            </div>
                        </transition-group>

                        <p class="mt-20 ft-xs-medium">Attention, cette liste est perdue quand tu quittes la page. Pense à les copier en sécurité !</p>
                    </div>
                </div>

                <advice-block class="mt-20 is-precious" type="tag-generator" v-if="!isInsert" />
            </div>
            <div class="col-6 col-12@s mt-20@s">
                <div class="bg-precious-xweak p-20 br-m text-center">
                    <div>
                        <transition-group tag="div" name="tag">
                            <div class="ShopTag mb-10 mh-5" :class="{ 'is-loading': isLoading }" @click="$copy(tag.value)" v-for="tag in displayedTags.filter(r => r.visible)" :key="tag.order">
                                <span>
                                    <i class="fal fa-plus" @click.stop="save(tag.value, tag.order)" v-if="!saved.includes(tag.value)"></i>

                                    <span>{{ tag.value }}</span>
                                </span>
                            </div>
                        </transition-group>

                        <div :class="{ 'mt-10': displayedTags.length > 0 }">
                            <button-base :modifiers="displayedTags.length > 0 ? ['secondary', 's'] : ['precious']" :class="{ 'is-loading': isLoading, 'is-disabled': !search }" icon-before="arrows-rotate" type="submit">
                                Générer
                            </button-base>
                        </div>
                    </div>
                </div>

                <div class="b mt-20 p-20 br-m" v-if="excluded.length > 0">
                    <div class="ft-s-medium mb-15">
                        Historique
                    </div>
                    
                    <transition-group tag="div" name="tag">
                        <div class="ShopTag ShopTag--s ShopTag--border m-3 is-weak" v-for="tag in tagHistory" @click="toggleTag(tag)" :key="tag">
                            <span>
                                <i class="fal fa-plus" @click.stop="save(tag)" v-if="!saved.includes(tag)"></i>
                                <span>{{ tag }}</span>
                            </span>
                        </div>
                    </transition-group>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { InputBase } from 'instant-coffee-core'
import StringSimilarity from 'string-similarity'

const BLACKLIST = [ '&quot;', 'avec', 'faites', 'fait', 'main', 'elle', 'pour', 'sur', 'dans', 'fait main', 'une', 'for', 'one' ]

export default {
    name: 'TagGenerator',
    components: { InputBase },
    props: {
        isInsert: { type: Boolean, default: false }
    },
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
        },
        tagHistory () {
            return [ ...this.excluded ].reverse().slice(0, 20)
        }
    },
    methods: {
        save (tag, replace = null) {
            this.saved.push(tag)

            if (replace !== null) {
                let newTag = { ...this.getNextTag(), order: replace }
                if (newTag && !this.allExclusions.includes(newTag.value)) this.displayedTags = this.displayedTags.map(t => t.order == newTag.order ? newTag : t)
            }
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
            this.isLoading = true

            this.excluded = [ ...this.excluded, ...this.displayedTags.map(t => t.value) ]

            if (search) this.search = search

            if (this.lastSearch == this.search && this.allTags.length > 6) {
                await new Promise(resolve => setTimeout(resolve, 800))

                this.displayedTags = this.$shuffle(this.allTags.slice(0, 6).map((r, i) => ({ ...r, order: i }))) 
                this.allTags = this.allTags.slice(6)
            } else {
                this.offset = this.lastSearch == this.search ? this.offset + 30 : 0

                this.lastSearch = this.search

                let response = await this.$store.dispatch('etsy/similarTags', {
                    keywords: this.search,
                    offset: this.offset,
                    samples: 1,
                    limit: 100
                })

                if (response) {
                    this.results = response
                    this.orderTags()
                }
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

                    return [ ...total, ...r.tags.map(t => ({ value: t.toLowerCase().replace('&#39;', `'`), info })), ...titles.map(t => ({ value: t.toLowerCase().replace('&#39;', `'`), info })) ]
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

                if (!added) {
                    let score = this.search.split(' ').filter(element => tag.value.split(' ').includes(element)).length * 2
                    if (tag.value.includes(' ')) score += 0.5

                    results.push({ value: tag.value, listing: tag.info.listing, id: Math.random(), score, info: [ tag.info ] })
                }
            })
        
            results = results.map(result => {
                let visible = true

                if (result.score <= 0.5) {
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
        cursor: pointer;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px 0 var(--color-shadow-50);
        }
        
        & > span {
            display: flex;
            align-items: center;
            height: 42px;
            transition: all 150ms ease-in-out;

            i {
                height: 30px;
                width: 30px;
                margin: 0 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 50%;

                &:hover {
                    background-color: var(--color-bg-xweak);
                }
            }

            & > span:last-child {
                margin-right: 15px;
            }

            & > span:first-child {
                margin-left: 15px;
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

    .ShopTag--s {

        & > span {
            height: 30px;

            i {
                height: 25px;
                width: 25px;
                margin: 0 3px;
            }

            & > span:last-child {
                margin-right: 10px;
            }

            & > span:first-child {
                margin-left: 10px;
            }
        }
    }

    .ShopTag--border {
        background: transparent;
        border: 2px solid var(--color-onyx);
    }

    .ShopTag.is-loading {
        pointer-events: none;

        & > span {
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

        &:hover {
            opacity: 1;
        }
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