require('dotenv').config()
module.exports = {
    env: {
        WS_URL: process.env.WS_URL || 'http://127.0.0.1:3001'
    },
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: process.env.npm_package_name || '',
        titleTemplate: '%s - theFactWall.com',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#28b76c'},
    /*
    ** Global CSS
    */
    css: [
        '@fortawesome/fontawesome-free/css/all.css',
        'buefy/dist/buefy.css',
        '@/style/_app.scss',
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {src: '@/plugins/components.js', ssr: true},
        '@/plugins/mixins',
        '@/plugins/repository',
        '@/plugins/schema',
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://buefy.github.io/#/documentation
        ['nuxt-buefy', {css: false, materialDesignIcons: false}],
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        ['@nuxtjs/google-analytics', {
            id: 'UA-147540125-1'
        }]
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseURL: process.env.API_DOMAIN
    },
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/users/login/',
                        method: 'post',
                        propertyName: 'token',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    },
                    logout: {
                        method: 'post',
                        url: '/users/logout/'
                    },
                    user: {
                        url: '/users/me/',
                        method: 'get',
                        propertyName: ''
                    }
                },
                tokenRequired: true,
                tokenType: 'Bearer'
            },
            google: {
                client_id:
                    '1031942923634-j4m66uaj8toiphphkj2q8q0thkh9horu.apps.googleusercontent.com',
                redirect_uri: process.env.DOMAIN + '/member/callback'
            }
        },
        redirect: {
            login: '/login',
            logout: '/logout',
            callback: '/auth/callback',
            user: '/users/me'
        },
    },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
        }
    }
}
