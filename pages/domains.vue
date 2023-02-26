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
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <div class="form-group flex">
            <button
              class="btn bg-green-500 m-2 w-20"
              @click="showEditModal(record.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit
            </button>
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

  <!-- Edit modal  -->
  <div
    class="h-screen w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
    v-if="editDomainVisibility"
  >
    <div
      class="lg:w-2/5 shadow-md border-r-2 p-5 bg-slate-50 sm:w-3/4 border-sky-500"
    >
      <div class="flex justify-end items-end mb-4">
        <button
          class="px-4 py-2 rounded border-gray-100 bg-sky-500 text-white self-end"
          @click="toggleEditModal"
        >
          Close
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <form @submit.prevent="updateDomain">
          <div class="form-group">
            <label for="">Email Address</label>
            <input
              type="email"
              class="form-input"
              placeholder="Enter user email address"
              v-model="currentDomain.email"
            />
          </div>
          <div class="form-group">
            <label for="">Domain name</label>
            <input
              type="url"
              class="form-input"
              placeholder="Domain name"
              v-model="currentDomain.domain"
            />
          </div>

          <div class="form-group" v-html="domainError"></div>
          <div class="form-group">
            <button class="btn">Update Domain</button>
          </div>
        </form>
      </div>

      <!-- End of content -->
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { print_error, print_success } from "../composables/print";

const { apiBaseUrl } = useAppConfig();

const domains = ref([]);
const domainsColumns = [
  { title: "Domain", dataIndex: "domain" },
  { title: "Email", dataIndex: "email" },
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
const editDomainVisibility = ref(false);

const toggleEditModal = () => {
  editDomainVisibility.value = !editDomainVisibility.value;
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
        domainError.value = print_success(res.data.message);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          let errors = err.response.data.error;

          errors.forEach((er) => {
            domainError.value += print_error(er.message);
          });
        } else {
          domainError.value = "";
          domainError.value = print_error(err.response.data.message);
        }
      });
  } else {
    domainError.value = print_error("All fields required");
  }
};

// Show edit modal
const currentDomain = reactive({
  domain: "",
  id: undefined,
  user_id: undefined,
  email: "",
});
const showEditModal = async (id) => {
  // show edit modal
  toggleEditModal();
  await axios
    .get(`${apiBaseUrl}/domains/${id}`)
    .then((res) => {
      const data = res.data.data[0];
      currentDomain.domain = data.domain;
      currentDomain.id = data.id;
      currentDomain.user_id = data.user_id;
      currentDomain.email = data.email;
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateDomain = () => {
  if (
    currentDomain.email.trim().length > 0 &&
    currentDomain.domain.trim().length > 0
  ) {
    // Send add request
    domainError.value = "";
    axios
      .put(`${apiBaseUrl}/domains/${currentDomain.id}`, {
        domain: currentDomain.domain,
        user_id: currentDomain.user_id,
      })
      .then((res) => {
        domainError.value = print_success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          let errors = err.response.data.error;

          errors.forEach((er) => {
            domainError.value += print_error(er.message);
          });
        } else {
          domainError.value = "";
          domainError.value = print_error(err.response.data.message);
        }
      });
  } else {
    domainError.value = print_error("All fields required");
  }
};
</script>

<style></style>
