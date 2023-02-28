<template>
  <div class="w-full p-5 h-full flex items-center justify-center">
    <div
      class="block p-6 rounded-lg shadow-lg bg-white max-w-sm sm:w-full md:w-1/2"
    >
      <form @submit.prevent="login">
        <h1 class="text-center text-lg font-bold uppercase">Login</h1>
        <div class="form-group mb-6">
          <label for="" class="form-label inline-block mb-2 text-gray-700"
            >Email address</label
          >
          <input
            type="email"
            class="form-control form-input"
            placeholder="Enter email"
            v-model="email"
          />
        </div>
        <div class="form-group mb-6">
          <label class="form-label inline-block mb-2 text-gray-700"
            >Password</label
          >
          <input
            type="password"
            class="form-control form-input"
            placeholder="Password"
            v-model="password"
          />
        </div>
        <div class="flex justify-end items-center mb-4">
          <a
            href="#!"
            class="text-cyan-600 hover:text-cyan-700 focus:text-cyan-700 transition duration-200 ease-in-out"
            >Forgot password?</a
          >
        </div>
        <div v-if="error" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <button type="submit" class="btn">
          <span v-if="isFormSubmitLoading">Loading</span>
          <span v-else> Log in</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
const { signIn, status } = useSession();

definePageMeta({ auth: false });
const { apiBaseUrl } = useAppConfig();

definePageMeta({
  layout: "custom",
  auth: false,
});
const email = ref("");
const password = ref("");
const error = ref(false);
const isFormSubmitLoading = ref(false);
let errorMessage = ref("");

// LOGIN METHOD
const login = async (e) => {
  // check email and password
  if (email.value.length > 0 && password.value.length > 0) {
    error.value = false;
    isFormSubmitLoading.value = true;
    // show loaders, disabled the button, and send request
    await this$.api
      .post(`${apiBaseUrl}/auth/login`, {
        email: email.value,
        password: password.value,
      })
      .then(async (res) => {
        // Set the localStorage

        const response = res.data.data;
        const token = response.token;
        const email = response.user.email;
        const user_id = response.user.id;
        await signIn("credentials", { token, email, user_id, redirect: false });
        navigateTo("/");
      })
      .catch((err) => {
        // Show error message
        console.log(err);

        error.value = true;
        if (err.response && err.response.data.message)
          errorMessage.value = err.response.data.message;
      });
  } else {
    errorMessage.value = "All fields required";
    error.value = true;
  }
  // send request for email validation
};
</script>
