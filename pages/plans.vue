<template>
  <div class="flex-1 flex items-center justify-center flex-col">
    <!-- Modals  -->
    <!-- Add Plans modals  -->
    <div
      class="h-screen w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
      v-if="modalVisibility"
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
          <form @submit.prevent="addNewPlan">
            <div class="form-group">
              <label for="">Name</label>
              <input
                type="text"
                class="form-input"
                placeholder="Name"
                v-model="addPlanDetail.name"
              />
            </div>

            <div class="form-group">
              <label for="payment_id">Payment ID</label>
              <input
                type="text"
                class="form-input"
                placeholder="Payment ID"
                v-model="addPlanDetail.paymentId"
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="3"
                class="form-input"
                placeholder="Plan description"
                v-model="addPlanDetail.description"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="rules">Rules</label>
              <input
                type="text"
                class="form-input"
                placeholder="Scope"
                v-model="addPlanDetail.rules"
              />
            </div>

            <div class="form-group">
              <label for="price">Price</label>
              <input
                type="number"
                placeholder="Price"
                class="form-input"
                v-model="addPlanDetail.price"
              />
            </div>
            <div class="form-group" v-html="planError"></div>
            <div class="form-group">
              <button class="btn">Add Plan</button>
            </div>
          </form>
        </div>

        <!-- End of content -->
      </div>
    </div>

    <!-- Edit Plans Modal  -->
    <div
      class="h-screen w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
      v-if="editModalVisibility"
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
          <form @submit.prevent="updatePlan">
            <div class="form-group">
              <label for="">Name</label>
              <input
                type="text"
                class="form-input"
                placeholder="Name"
                v-model="currentPlanDetail.name"
              />
            </div>

            <div class="form-group">
              <label for="payment_id">Payment ID</label>
              <input
                type="text"
                class="form-input"
                placeholder="Payment ID"
                v-model="currentPlanDetail.payment_id"
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="3"
                class="form-input"
                placeholder="Plan description"
                v-model="currentPlanDetail.description"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="rules">Rules</label>
              <input
                type="text"
                class="form-input"
                placeholder="Scope"
                v-model="currentPlanDetail.rules"
              />
            </div>

            <div class="form-group">
              <label for="price">Price</label>
              <input
                type="number"
                placeholder="Price"
                class="form-input"
                v-model="currentPlanDetail.price"
              />
            </div>
            <div class="form-group" v-html="planError"></div>
            <div class="form-group">
              <button class="btn">Update Plan</button>
            </div>
          </form>
        </div>

        <!-- End of content -->
      </div>
    </div>
    <!-- End of Modals  -->
    <h1 class="text-left self-start text-xl mt-5">Plan Management</h1>
    <div class="p-5 flex justify-end w-full">
      <button
        class="outline px-4 py-2 rounded bg-sky-500 text-white flex"
        @click="toggleModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 mr-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        Add Plan
      </button>
    </div>

    <a-table :columns="plansColumns" :dataSource="plans">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="form-group">
            <select
              name="action"
              id=""
              class="p-2 block outline-1 orm-control form-input w-32"
              @change="showEditModal(record.id)"
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
import axios from "axios";
import { print_error, print_success } from "../composables/print";

const { apiBaseUrl } = useAppConfig();

const plans = ref([]);
const plansColumns = [
  { title: "Name", dataIndex: "name" },
  { title: "Payment ID", dataIndex: "payment_id" },
  { title: "Description", dataIndex: "description" },
  { title: "Rules", dataIndex: "rules" },
  { title: "Price", dataIndex: "price" },
  { title: "Action", key: "action" },
];

await axios
  .get(`${apiBaseUrl}/plans`)
  .then((res) => {
    plans.value = res.data;
  })
  .catch((err) => {
    console.log(err);
  });

// Plans
const addPlanDetail = ref({
  name: "",
  paymentId: "",
  description: "",
  rules: "",
  price: 0,
});

const planError = ref("");

const addNewPlan = () => {
  // validate the imports
  const { name, paymentId, description, rules, price } = addPlanDetail.value;

  if (
    name.trim().length > 0 &&
    paymentId.trim().length > 0 &&
    description.trim().length > 0 &&
    rules.trim().length > 0 &&
    price > 0
  ) {
    // call the endpoint for submit
    planError.value = "";

    axios
      .post(`${apiBaseUrl}/plans`, {
        name,
        payment_id: paymentId,
        description,
        rules,
        price,
      })
      .then((res) => {
        planError.value = print_success(res.data.message);
      })
      .catch((err) => {
        planError.value = print_error(err.response.data.message);
        console.log(err);
      });
  } else {
    planError.value = print_error("All fields is required");
  }
};

// toggle modal
let modalVisibility = ref(false);
function toggleModal() {
  modalVisibility.value = !modalVisibility.value;
}

// Edit Plans
const currentPlanDetail = reactive({
  id: undefined,
  name: "",
  payment_id: "",
  description: "",
  rules: "",
  price: "",
});
let editModalVisibility = ref(false);

function toggleEditModal() {
  editModalVisibility.value = !editModalVisibility.value;
}
const showEditModal = async (id) => {
  editModalVisibility.value = !editModalVisibility.value;
  // Get the record from database
  await axios
    .get(`${apiBaseUrl}/plans/${id}`)
    .then((res) => {
      const { name, id, payment_id, price, rules, description } = res.data.data;
      currentPlanDetail.name = name;
      (currentPlanDetail.id = id),
        (currentPlanDetail.payment_id = payment_id),
        (currentPlanDetail.price = price),
        (currentPlanDetail.rules = rules);
      currentPlanDetail.description = description;
    })
    .catch((err) => {
      console.log(err);
    });
};

const updatePlan = async () => {
  // validate

  if (
    currentPlanDetail.name.trim().length > 0 &&
    currentPlanDetail.payment_id.trim().length > 0 &&
    currentPlanDetail.description.trim().length > 0 &&
    currentPlanDetail.rules.trim().length > 0 &&
    currentPlanDetail.price > 0
  ) {
    // update plan
    axios
      .put(`${apiBaseUrl}/plans/${currentPlanDetail.id}`, {
        name: currentPlanDetail.name,
        payment_id: currentPlanDetail.payment_id,
        description: currentPlanDetail.description,
        rules: currentPlanDetail.rules,
        price: currentPlanDetail.price,
      })
      .then((res) => {
        planError.value = print_success(res.data.message);
      })
      .catch((err) => {
        planError.value = print_error(err.response.data.message);
      });
  } else {
    planError.value = print_error("All fields is required");
  }
};
</script>
