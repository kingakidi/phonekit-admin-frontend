module.exports = {
  apps: [
    {
      name: "PhoneKit Admin Dashboard",
      port: "5405",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
