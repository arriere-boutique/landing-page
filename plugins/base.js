import Vue from 'vue'
import moment from 'moment'
import { ButtonBase, PopinBase } from '@instant-coffee/core'
import LogoYellow from '@/assets/img/logo/logo-yellow.png'

moment.locale('fr')

Vue.mixin({
    filters: {
        specials: (value) => {
            if (!value || process.server) return ''

            let characters = ['?', '!', ':']
            
            characters.forEach(char => {
                value = value.replaceAll(' ' + char, ' ' + char)
            })

            return value
        },
        striptags: (value) => {
            return value.replace(/(<([^>]+)>)/gi, "")
        }
    },
    data: () => ({
        $categories: {
            news: { color: 'amber', fa: 'fa-thumbtack', slug: 'actualite' },
            seo: { color: 'malachite', fa: 'fa-search', slug: 'referencement-seo' },
            identity: { color: 'amethyst', fa: 'fa-store', slug: 'identite-de-marque' },
            value: { color: 'ruby', fa: 'fa-gem', slug: 'valeur-percue' }
        }
    }),
    methods: {
        randomBetween: (min, max) => {
            Math.floor(Math.random() * (max - min + 1) + min)
        },
        tooltipOpen (content, e, params = {}) {
            this.$store.commit('tooltips/open', {
                content, element: e.target, ...params
            })
        },
        tooltipClose () {
            this.$store.commit('tooltips/close')
        },
        $theme (value) {
            let theme = { color: 'amber', fa: 'fa-heart' }

            theme = this.$data.$categories[value]

            return theme
        },
        $slugToCategory (slug) {
            let result = ''

            Object.keys(this.$data.$categories).forEach(key => {
                if (this.$data.$categories[key].slug == slug) result = key
            })

            return result
        },  
        $absolute (value) {
            return process.env.BASE_URL + value
        },
        $authorData () {
            return {
                "@type": "Person",
                name: "Théotime Colin",
                brand: {
                    "@type": "Organization",
                    name: "L'Arrière Boutique",
                    email: "contact@arriere-boutique.fr",
                    logo: this.$absolute(LogoYellow),
                }
            }
        }
    }
})

Vue.component('ButtonBase', ButtonBase)
Vue.component('PopinBase', PopinBase)