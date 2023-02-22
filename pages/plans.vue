<template>
  <div class="flex-1 flex items-center justify-center">
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
