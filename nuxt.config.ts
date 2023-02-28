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
      charset: "utf-16",
      viewport: "width=500, initial-scale=1",
      title: "Phonekit - Admin Dashboard",
      meta: [
        // <meta name="description" content="My amazing site">
        { name: "description", content: "PhoneKit Admin Dashboard" },
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
    origin: "https://admin.phonekit.io",
  },
});
