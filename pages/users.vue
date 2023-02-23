<template>
  <div class="flex-1 flex items-center justify-center flex-col">
    <!-- Modals  -->
    <!-- create users modal -->
    <div>
      <div
        class="h-full w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
        v-if="isVisibleModal"
      >
        <div
          class="lg:w-2/5 shadow-md border-r-2 p-5 bg-slate-50 sm:w-3/4 border-sky-500"
        >
          <div class="flex justify-end items-end mb-4">
            <button
              class="px-4 py-2 rounded border-gray-100 bg-sky-500 text-white self-end"
              @click="showModal"
            >
              Close
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <form id="addUser" @submit.prevent="addNewUser">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Enter your name"
                  v-model="newUsersData.name"
                />
              </div>
              <div class="form-group">
                <label for="email" class="form-label"> Email address</label>
                <input
                  type="email"
                  class="form-input"
                  placeholder="Enter your email"
                  v-model="newUsersData.email"
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Phone number</label>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  class="form-input"
                  placeholder="Enter phone number"
                  v-model="newUsersData.phone"
                />
              </div>

              <div class="form-group">
                <label for="location" class="form-label">Location</label>
                <select
                  name="location"
                  id="location"
                  class="form-input"
                  v-model="newUsersData.location"
                >
                  <option value="">Select Location</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="us">United State of America</option>
                  <option value="uk">United Kingdom</option>
                  <option value="canada">Canada</option>
                </select>
              </div>
              <div class="form-group">
                <label for="password" class="input-label"> Password </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  class="form-input"
                  v-model="newUsersData.password"
                />
              </div>

              <div class="form-group" v-html="addUserError"></div>
              <div class="form-group">
                <button class="btn bg-sky-500" type="submit">Add User</button>
              </div>
            </form>
          </div>

          <!-- End of content -->
        </div>
      </div>

      <!-- Edit user modal  -->

      <div
        class="h-full w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
        v-if="isEditUserModal"
      >
        <div
          class="lg:w-2/5 shadow-md border-r-2 p-5 bg-slate-50 sm:w-3/4 border-sky-500"
        >
          <div class="flex justify-end items-end mb-4">
            <button
              class="px-4 py-2 rounded border-gray-100 bg-sky-500 text-white self-end"
              @click="showEditModal"
            >
              Close
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <form id="addUser" @submit.prevent="submitEditUser">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Enter your name"
                  v-model="currentUserData.name"
                />
              </div>
              <div class="form-group">
                <label for="email" class="form-label"> Email address</label>
                <input
                  type="email"
                  class="form-input"
                  placeholder="Enter your email"
                  v-model="currentUserData.email"
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Phone number</label>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  class="form-input"
                  placeholder="Enter phone number"
                  v-model="currentUserData.phone"
                />
              </div>

              <div class="form-group">
                <label for="password" class="input-label"> Password </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  class="form-input"
                  v-model="currentUserData.password"
                />
              </div>

              <div class="form-group" v-html="editUserError"></div>
              <div class="form-group">
                <button class="btn bg-sky-500" type="submit">
                  Update User
                </button>
              </div>
            </form>
          </div>

          <!-- End of content -->
        </div>
      </div>

      <!-- End of edit user modal -->
    </div>

    <!-- End of Create users modal  -->
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
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="form-group">
            <select
              name="action"
              id=""
              class="p-2 block outline-1 orm-control form-input w-32"
              @change="updateUser(record.id)"
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
const { apiBaseUrl } = useAppConfig();

let isVisibleModal = ref(false);
let isEditUserModal = ref(false);

let users = ref([]);
let newUsersData = ref({
  name: "",
  email: "",
  phone: "",
  location: "",
  password: "",
});
let addUserError = ref("");
let editUserError = ref("");

let userColumns = [
  { title: "Name", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  { title: "Phone", dataIndex: "phone" },
  { title: "Credit", dataIndex: "credit" },
  { title: "Action", key: "action" },
];

let currentUserData = ref({
  name: "",
  email: "",
  password: "",
  phone: "",
  location: "",
});
await axios
  .get(`${apiBaseUrl}/users`)
  .then((res) => {
    users.value = res.data;
  })
  .catch((err) => {
    console.log(err);
  });

const showModal = () => {
  isVisibleModal.value = !isVisibleModal.value;
};

const showEditModal = () => {
  isEditUserModal.value = !isEditUserModal.value;
};

const addNewUser = async () => {
  const { name, email, phone, password, location } = newUsersData.value;
  const data = [name, email, phone, password, location];

  data.forEach((value) => {
    addUserError.value = "";
    if (value.length <= 0) {
      addUserError.value = `<span class="text-red-500">All fields is required </span>`;
      return;
    }
  });

  const userError = addUserError.value;

  if (userError.length === 0) {
    addUserError.value = "";

    // Send user data to backend
    await axios
      .post(`${apiBaseUrl}/users`, {
        name,
        email,
        password,
        location,
        phone,
        credit: 0,
      })
      .then((res) => {
        // check status of the response
        if (res.status === 201) {
          addUserError.value = success(res.data.message);
        }
      })
      .catch((err) => {
        addUserError.value = error(err.response.data.message);
        console.log(err.response);
      });
  }

  // send the values to backend
};

// update user
const updateUser = async (id) => {
  // Get the user details
  isEditUserModal.value = true;
  currentUserData.value["id"] = id;
  await axios
    .get(`${apiBaseUrl}/users/${id}`)
    .then((res) => {
      if (res.data && res.data.length > 0) {
        delete res.data.password;
        let data = res.data[0];
        currentUserData.value.name = data.name;
        currentUserData.value.email = data.email;
        currentUserData.value.location = data.location;
        currentUserData.value.phone = data.phone;
      }
      // Assign the user details to a variable
    })
    .catch((err) => {
      console.log(err.message);
      editUserError.value = error(err.response.data.message);
    });
};

// submit edited user
const submitEditUser = async () => {
  // check for name and email values
  if (currentUserData.value.name !== "" || currentUserData.value.email !== "") {
    // send update request

    await axios
      .put(`${apiBaseUrl}/users/${currentUserData.value.id}`, {
        name: currentUserData.value.name,
        email: currentUserData.value.email,
        phone: currentUserData.value.phone,
      })
      .then((res) => {
        console.log(res);
        editUserError.value = success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        editUserError.value = error(err.response.data.message);
      });
  } else {
    editUserError.value = error("Name and email is required");
  }
};

function error(x) {
  return `<span class="text-red-500"> ${x} </span>`;
}

function success(x) {
  return `<span class="text-green-500"> ${x} </span>`;
}
</script>
