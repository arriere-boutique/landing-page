require('dotenv').config()
import redirectSSL from 'redirect-ssl'

export default {
    head: {
        title: `L'Arrière Boutique, propulsez votre boutique Etsy`,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
            { rel: 'stylesheet', href: 'https://assets.calendly.com/assets/external/widget.css' }
        ],
        script: [
            { src: 'https://assets.calendly.com/assets/external/widget.js', type: 'text/javascript', async: true },
            { src: 'sib.js', type: 'text/javascript', async: true }
        ]
    },
    
    css: [
        '@/assets/scss/global.scss'
    ],

    plugins: [
        { src: '@/plugins/base.js' }
    ],

    components: true,

    buildModules: [
        '@nuxtjs/google-analytics'
    ],

    modules: [
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
        'nuxt-i18n',
        '@nuxtjs/auth',
        '@nuxtjs/google-analytics',
        [ '@nuxtjs/recaptcha', {
            hideBadge: true,
            version: 3,
            siteKey: process.env.RECAPTCHA
        } ],
    ],

    publicRuntimeConfig: {
        recaptcha: {
            siteKey: process.env.RECAPTCHA
        },
        googleAnalytics: {
            id: process.env.GA_ID
        }
    },

    googleAnalytics: {
        id: process.env.GA_ID
    },

    i18n: {
        locales: [
            { code: 'fr', iso: 'fr-FR', file: 'fr.js' }
        ],
        langDir: '/translations/',
        defaultLocale: 'fr',
        lazy: true
    },

    serverMiddleware: [
        { path: '/api', handler: '~/api' },
        redirectSSL.create({ enabled: process.env.NODE_ENV === 'PRODUCTION' })
    ],

    auth: {
        redirect: {
            logout: '/',
            login: '/admin/dashboard',
            home: '/',
            callback: false
        },
        strategies: {
            local: {
                endpoints: {
                    login: { url: process.env.NUXT_ENV_API_URL + '/user', method: 'post', propertyName: 'token' },
                    logout: { url: process.env.NUXT_ENV_API_URL + '/user/logout', method: 'post' },
                    user: { url: process.env.NUXT_ENV_API_URL + '/user', method: 'get', propertyName: 'user' }
                }
            }
        }
    },

    build: {
        extend (config) {
            config.module.rules.push({
                test: /\.svg.html$/,
                loader: 'raw-loader'
            })
        }
    },
    
    axios: {
        baseURL: process.env.NUXT_ENV_API_URL
    },

    router: {
        linkActiveClass: 'is-active',
        linkExactActiveClass: 'is-active'
    }
}
