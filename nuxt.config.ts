// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/image'
  ],
  devtools: { enabled: true },
  colorMode: {
    classSuffix: ''
  },

  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-07-30',
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  }
})
