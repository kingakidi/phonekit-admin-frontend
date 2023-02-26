// https://nuxt.com/docs/api/configuration/nuxt-config\
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  tailwindcss: {
    configPath: "tailwind.config",
  },

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.lineicons.com/4.0/lineicons.css",
        },
      ],
    },
  },

  plugins: ["@/plugins/antd"],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },

  // Bringing authentication configuration
  auth: {
    enableGlobalAppMiddleware: true,
    origin: "http://localhost:3000",
  },
});
