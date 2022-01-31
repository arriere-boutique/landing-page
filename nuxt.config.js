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

    styleResources: {
        scss: [
            '@/assets/scss/base/config.scss',
            'instant-coffee-core/assets/scss/variables.scss',
            'instant-coffee-core/assets/scss/mixins.scss'
        ]
    },

    plugins: [
        { src: '@/plugins/base.js' }
    ],

    env: {
        baseDomain: process.env.BASE_DOMAIN,
        baseUrl: process.env.BASE_URL,
        blogUrl: process.env.BLOG_URL,
        boutiqueUrl: process.env.SHOP_URL,
        dashboardUrl: process.env.DASHBOARD_URL,
        PEXELS: process.env.PEXELS,
        etsy: process.env.ETSY
    },

    components: true,

    buildModules: [
        '@nuxtjs/google-analytics',
        '@nuxtjs/moment',
        [
            '@nuxtjs/router',
            {
                path: 'router',
                fileName: 'index.js',
                keepDefaultRouter: true,
            }
        ]
    ],

    modules: [
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
        'nuxt-i18n',
        '@nuxtjs/auth',
        '@nuxtjs/moment',
        '@nuxtjs/google-analytics',
        '@nuxtjs/style-resources',
        [ '@nuxtjs/recaptcha', {
            hideBadge: true,
            version: 3,
            siteKey: process.env.RECAPTCHA
        } ],
        ['nuxt-stripe-module', {
            publishableKey: process.env.STRIPE_PUBLIC,
        }],
    ],

    moment: {
        defaultLocale: 'fr',
        locales: ['fr']
    },

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
        cookie: {
          options: {
            domain: '.' + process.env.BASE_DOMAIN
          }
        },
        redirect: {
            logout: false,
            login: '/compte/login',
            home: false,
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
        },
        babel: {
            presets(env, [preset, options]) {
                return [["@babel/preset-env", {}]];
            },
            plugins: [
                [
                "@babel/plugin-transform-runtime",
                {
                    regenerator: true
                }
                ]
            ]
        }      
    },
    
    axios: {
        baseURL: process.env.NUXT_ENV_API_URL
    },

    router: {
        linkActiveClass: 'is-active',
        linkExactActiveClass: 'is-active-exact'
    }
}
