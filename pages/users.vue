<template>
  <div class="flex-1 flex items-center justify-center flex-col">
    <!-- Modals  -->
    <modal class="" v-if="isAddUser" :showModal="isAddUser">
      how are yo doing
    </modal>
    <!-- End of Modals  -->
    <h1 class="text-left self-start text-xl mt-5">Users Management</h1>
    <div class="p-5 flex justify-end w-full">
      <button
        class="outline px-4 py-2 rounded bg-sky-500 text-white"
        @click="showModal"
      >
        Add User
      </button>
    </div>
    <a-table :columns="userColumns" :dataSource="users">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <div class="form-group">
            <select
              name="action"
              id=""
              class="p-2 block outline-1 orm-control form-input w-32"
            >
              <option value="select">Select actions</option>
              <option value="">Edit</option>
              <option value="">Deactivate</option>
            </select>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import modal from "~~/components/utils/modal.vue";

import axios from "axios";
const { apiBaseUrl } = useAppConfig();

const isAddUser = ref(false);
const users = ref([]);
const userColumns = [
  { title: "Name", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  { title: "Phone", dataIndex: "phone" },
  { title: "Credit", dataIndex: "credit" },
  { title: "Action", key: "action" },
];

await axios
  .get(`${apiBaseUrl}/users`)
  .then((res) => {
    users.value = res.data;
  })
  .catch((err) => {
    console.log(err);
  });

const showModal = () => {
  isAddUser.value = !isAddUser.value;
};
</script>
