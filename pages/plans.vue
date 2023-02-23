<template>
  <div class="flex-1 flex items-center justify-center flex-col">
    <h1 class="text-left self-start text-xl mt-5">Users Management</h1>
    <div class="p-5 flex justify-end w-full">
      <button
        class="outline px-4 py-2 rounded bg-sky-500 text-white"
        @click="showModal"
      >
        Add Plan
      </button>
    </div>
    <a-table :columns="plansColumns" :dataSource="plans">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'"> this is action </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import axios from "axios";
const { apiBaseUrl } = useAppConfig();

const plans = ref([]);
const plansColumns = [
  { title: "Name", dataIndex: "name" },
  { title: "Payment ID", dataIndex: "payment_id" },
  { title: "Description", dataIndex: "description" },
  { title: "Rules", dataIndex: "rules" },
  { title: "Price", dataIndex: "price" },
];

await axios
  .get(`${apiBaseUrl}/plans`)
  .then((res) => {
    plans.value = res.data;
  })
  .catch((err) => {
    console.log(err);
  });
</script>
