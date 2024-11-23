
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  types: [
    "@nuxt/types", 
    "@nuxtjs/auth",
  ],
  modules: [
    "@nuxt-alt/auth",
    "@nuxt-alt/http",
    "@pinia/nuxt",
  ],
  build: {
    transpile: ['pinia-plugin-persistedstate', "three"],
  },
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/',
      callback: '/auth/callback',
    },
    strategies: {
      discord: {
        clientId: process.env.DISCORD_AUTH_CLIENTID,
        clientSecret: process.env.DISCORD_AUTH_CLIENTSECRET,
      },
    },
    enableMiddleware: false
  },
  runtimeConfig: {
    dbURI: process.env.MONGO_URI
  },
  router: {
    middleware: ["auth"]
  },
})
