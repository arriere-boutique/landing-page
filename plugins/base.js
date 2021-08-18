import Vue from 'vue'
import moment from 'moment'
import { ButtonBase, PopinBase } from '@instant-coffee/core'

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
        }
    },
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

            switch (value) {
                case 'news': theme = { color: 'amber', fa: 'fa-thumbtack' }; break;
                case 'seo': theme = { color: 'amazonite', fa: 'fa-search' }; break;
                case 'identity': theme = { color: 'amethyst', fa: 'fa-aperture' }; break;
                case 'value': theme = { color: 'ruby', fa: 'fa-gem' }; break;
            }

            return theme
        }
    }
})

Vue.component('ButtonBase', ButtonBase)
Vue.component('PopinBase', PopinBase)