// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    // Options
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
});
