<template>
  <div class="flex-1 flex items-center justify-center flex-col">
    <h1 class="text-left self-start text-xl mt-5">Domain Management</h1>
    <div class="p-5 flex justify-end w-full">
      <button
        class="outline px-4 py-2 rounded bg-sky-500 text-white"
        @click="toggleModal"
      >
        Add Domain
      </button>
    </div>
    <a-table :columns="domainsColumns" :dataSource="domains">
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'action'">
          <div class="form-group flex">
            <button class="btn bg-green-500 m-2 w-20">Edit</button>
            <button class="btn bg-blue-500 m-2 w-32">Generate SSL</button>
            <button class="btn bg-red-500 m-2 w-20">Delete</button>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <!-- Modal  -->
  <div
    class="h-screen w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
    v-if="addDomainVisibility"
  >
    <div
      class="lg:w-2/5 shadow-md border-r-2 p-5 bg-slate-50 sm:w-3/4 border-sky-500"
    >
      <div class="flex justify-end items-end mb-4">
        <button
          class="px-4 py-2 rounded border-gray-100 bg-sky-500 text-white self-end"
          @click="toggleModal"
        >
          Close
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <form @submit.prevent="addDomain">
          <div class="form-group">
            <label for="">Email Address</label>
            <input
              type="email"
              class="form-input"
              placeholder="Enter user email address"
              v-model="domainObject.email"
            />
          </div>
          <div class="form-group">
            <label for="">Domain name</label>
            <input
              type="url"
              class="form-input"
              placeholder="Domain name"
              v-model="domainObject.domain"
            />
          </div>

          <div class="form-group" v-html="domainError"></div>
          <div class="form-group">
            <button class="btn">Add Domain</button>
          </div>
        </form>
      </div>

      <!-- End of content -->
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
const { apiBaseUrl } = useAppConfig();

const domains = ref([]);
const domainsColumns = [
  { title: "Domain", dataIndex: "domain" },
  { title: "Email", dataIndex: "id" },
  { title: "Action", dataIndex: "action" },
];

await axios
  .get(`${apiBaseUrl}/domains`)
  .then((res) => {
    domains.value = res.data.data;
  })
  .catch((err) => {
    console.log(err.message);
  });

// Add Domain ssl
const domainError = ref("");
const addDomainVisibility = ref(false);
const toggleModal = () => {
  addDomainVisibility.value = !addDomainVisibility.value;
};

// add domain methods
const domainObject = reactive({
  email: "",
  domain: "",
});

const addDomain = () => {
  if (
    domainObject.email.trim().length > 0 &&
    domainObject.domain.trim().length > 0
  ) {
    // Send add request
    domainError.value = "";
    axios
      .post(`${apiBaseUrl}/domains`, {
        email: domainObject.email,
        domain: domainObject.domain,
      })
      .then((res) => {
        domainError.value = success(res.data.message);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          let errors = err.response.data.error;

          errors.forEach((er) => {
            domainError.value += error(er.message);
          });
        } else {
          domainError.value = "";
          domainError.value = error(err.response.data.message);
        }
      });
  } else {
    domainError.value = error("All fields required");
  }
};

function error(x) {
  return `<span class="text-red-500"> ${x} </span>`;
}

function success(x) {
  return `<span class="text-green-500"> ${x} </span>`;
}
</script>

<style></style>
