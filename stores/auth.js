import { defineStore } from "pinia";

export const authStore = defineStore("authStore", {
  state: () => {
    loginToken: 0;
  },
  actions: {
    setLoginToken(token) {
      this.loginToken = token;
    },
  },

  getters: {
    getLoginToken() {
      return this.loginToken;
    },
  },
});
