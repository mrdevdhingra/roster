import type loginVue from '~/pages/login.vue';
<template>
  <div class="container mx-auto">
    <h1>Staff</h1>

    <div class="flex justify-end">
      <button
        @click="addingStaff"
        class="rounded bg-blue-600 px-8 py-2 my-2 text-sm font-medium text-white"
      >
        Add Staff +
      </button>
    </div>

    <div class="rounded-lg border border-gray-200">
      <table class="min-w-full bg-white divide-y-2 divide-gray-200 text-sm">
        <thead class="bg-gray-100 border rounded-lg text-left">
          <tr>
            <th class="py-2 px-4 font-normal">Name</th>
            <th class="py-2 px-4 font-normal">Email</th>
            <th class="py-2 px-4 font-normal">Phone</th>
            <th class="py-2 px-4 font-normal">Stores</th>
            <th class="py-2 px-4"></th>
            <th class="py-2 px-4"></th>
            <th class="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Add Staff Form -->
          <tr v-if="isAddingStaff">
            <td class="py-2 px-4">
              <input
                type="text"
                v-model="newStaffName"
                class="w-full h-full border-2 rounded-md border-blue-500 bg-transparent py-2 px-4 m-0"
              />
            </td>
            <td class="py-2 px-4">
              <input
                type="text"
                v-model="newStaffEmail"
                class="w-full h-full border-2 rounded-md border-blue-500 bg-transparent py-2 px-4 m-0"
              />
            </td>
            <td class="py-2 px-4">
              <input
                type="text"
                v-model="newStaffNumber"
                class="w-full h-full border-2 rounded-md border-blue-500 bg-transparent py-2 px-4 m-0"
              />
            </td>
            <td class="py-2 px-4 relative">
              <button
                @click="toggleDropdown"
                class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Stores
              </button>

              <div
                v-if="isDropdownVisible"
                class="absolute z-10 mt-2 w-56 border rounded-md bg-white"
              >
                <div
                  v-for="store in storesData"
                  :key="store.id"
                  class="flex items-center border-b last:border-b-0 p-2"
                >
                  <input
                    type="checkbox"
                    :value="store.id"
                    v-model="newStaffStores"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label :for="`checkbox-${store.id}`" class="ml-2 text-sm">
                    {{ store.name }}
                  </label>
                </div>
              </div>
            </td>

            <td class="py-2 px-4">
              <button @click="handleSave(null)" class="text-blue-700">
                Save
              </button>
            </td>
            <td class="py-2 px-4">
              <button @click="notAddingStaff" class="text-red-700">
                Cancel
              </button>
            </td>
          </tr>

          <!-- Existing Staff Rows -->
          <tr v-for="(item, index) in storeAndStaffData" :key="item.id">
            <td v-if="editingIndex === index" class="py-2 px-4">
              <input
                type="text"
                v-model="editableStaff.name"
                class="w-full h-full border-2 rounded-md border-blue-500 bg-transparent py-2 px-4 m-0"
              />
            </td>
            <td v-else class="py-2 px-4">{{ item.name }}</td>
            <td v-if="editingIndex === index" class="py-2 px-4">
              <input
                type="text"
                v-model="editableStaff.email"
                class="w-full h-full border-2 rounded-md border-blue-500 bg-transparent py-2 px-4 m-0"
              />
            </td>
            <td v-else class="py-2 px-4">{{ item.email }}</td>
            <td v-if="editingIndex === index" class="py-2 px-4">
              <input
                type="text"
                v-model="editableStaff.phone_number"
                class="w-full h-full border-2 rounded-md border-blue-500 bg-transparent py-2 px-4 m-0"
              />
            </td>
            <td v-else class="py-2 px-4">{{ item.phone_number }}</td>
            <td v-if="editingIndex === index" class="py-2 px-4 relative">
              <button
                @click="toggleEditDropdown(index)"
                class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Edit Stores
              </button>
              <div class="absolute z-10 mt-2 w-56 border rounded-md bg-white">
                <div
                  v-for="store in storesData"
                  :key="store.id"
                  class="flex items-center border-b last:border-b-0 p-2"
                >
                  <input
                    type="checkbox"
                    :value="store.id"
                    :checked="isStoreChecked(store.id)"
                    @change="handleStoreChange(store.id)"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    :for="`edit-checkbox-${store.id}`"
                    class="ml-2 text-sm"
                  >
                    {{ store.name }}
                  </label>
                </div>
              </div>
            </td>

            <td v-else class="py-2 px-4">
              <h1 class="flex" v-for="storeName in item.stores">
                {{ storeName.storeName }}
              </h1>
            </td>
            <!-- Edit/Save and Cancel Buttons -->
            <td class="py-2 px-4">
              <button
                v-if="editingIndex === index"
                class="text-blue-700"
                @click="updateStaff"
              >
                Save
              </button>
              <button
                v-else
                @click="editStore(item, index)"
                class="text-blue-700"
              >
                Edit
              </button>
            </td>
            <td class="py-2 px-4">
              <button
                v-if="editingIndex === index"
                @click="cancelEdit"
                class="text-red-700"
              >
                Cancel
              </button>
              <button v-else class="text-blue-700">View</button>
            </td>
            <!-- <td v-if="editingIndex === -1" class="py-2 px-4">
                <button class="text-blue-700">View</button>
              </td> -->
            <td v-if="editingIndex === -1" @click="confirmDelete(item.id)" class="py-2 px-4">
              <button class="text-red-700">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
    >
      <div class="bg-black bg-opacity-50 absolute w-full h-full"></div>
      <div
        class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-gray-200"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="leading-6 text-gray-900">
                Are you sure you want to delete?
              </h3>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="handleDelete()" class="text-red-600 px-4 py-2 rounded">
            Yes
          </button>
          <button
            @click="showModal = false"
            class="text-black px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth";
import { supabase } from "../supabase/supabase";
const authStore = useAuthStore();
const user = authStore.user;

const staffData = ref([]);
let isAddingStaff = ref(false);
const editingRowId = ref(null);
let editingIndex = ref(-1); // -1 means no editing
const editableStaff = ref({});
const showModal = ref(false);
const idToDelete = ref(null);
const staffStoreData = ref([]);
let newStaffName = ref("");
let newStaffEmail = ref("");
let newStaffNumber = ref("");
let newStaffStores = ref([]);

let storeAndStaffData = ref("");
const storesData = ref([]);
const props = defineProps({
  workspace_id: { type: Number, required: true },
});
const workspaceId = computed(() => {
  return props.workspace_id;
});

let isDropdownVisible = ref(false);

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const fetchStaff = async () => {
  const { data, error } = await supabase.from("staff").select("*");

  if (!error) {
    staffData.value = data;
    console.log(staffData.value);
  } else {
    console.error(error);
  }
};

const getWorkspaceStores = async () => {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("workspace_id", workspaceId.value);

  if (data) {
    storesData.value = data;
    console.log(storesData.value);
  }
};

onMounted(getWorkspaceStores);

const fetchStaffStores = async () => {
  const { data, error } = await supabase
    .from("staffstores")
    .select(`staff(id,name,email,phone_number),stores(id,name)`);

  if (!error) {
    staffStoreData.value = data;
    console.log(staffStoreData.value);
  } else {
    console.error(error);
  }
};

const combineStaffAndStoreData = () => {
  const staffStoresMap = {};

  staffStoreData.value.forEach((item) => {
    const staffId = item.staff.id;
    const storeName = item.stores.name;
    const storeId = item.stores.id;

    if (!staffStoresMap[staffId]) {
      staffStoresMap[staffId] = {
        id: staffId,
        name: item.staff.name,
        email: item.staff.email,
        phone_number: item.staff.phone_number,
        stores: [{ storeName: storeName, storeID: storeId }],
      };
    } else {
      staffStoresMap[staffId].stores.push({
        storeName: storeName,
        storeID: storeId,
      });
    }
  });

  storeAndStaffData.value = Object.values(staffStoresMap);
  console.log(storeAndStaffData.value);
};

onMounted(async () => {
  await fetchStaff();
  await fetchStaffStores();
  combineStaffAndStoreData();
});

const handleSave = async () => {
  try {
    const { error } = await supabase.from("staff").insert({
      name: newStaffName.value,
      email: newStaffEmail.value,
      phone_number: newStaffNumber.value,
    });

    if (error) throw error;
    const { data, error: fetchError } = await supabase
      .from("staff")
      .select("id")
      .eq("email", newStaffEmail.value)
      .eq("phone_number", newStaffNumber.value);
    const newStaffId = data[0].id;

    for (const storeId of newStaffStores.value) {
      await addToStaffStoresDB(newStaffId, storeId);
    }
    newStaffName.value = "";
    newStaffEmail.value = "";
    newStaffNumber.value = "";
    newStaffStores.value = [];
    isAddingStaff.value = false;
    await fetchStaffStores();
    combineStaffAndStoreData();
  } catch (error) {
    console.error(error);
  }
};

const addToStaffStoresDB = async (staffId, storeId) => {
  try {
    const { error } = await supabase.from("staffstores").insert({
      staff_id: staffId,
      store_id: storeId,
    });

    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
};

const handleDelete = async () => {
  try {

    const { error:e } = await supabase
      .from("staffstores")
      .delete()
      .eq("staff_id", idToDelete.value );

    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", idToDelete.value );

      
    

    if (!error) {
      await fetchStaffStores();
      showModal.value = false;
    } else {
      console.error(error);
    }
  } catch (error) {
    console.error("Error deleting staff:", error);
  }
};

function addingStaff() {
  isAddingStaff.value = true;
  console.log(isAddingStaff.value);
}

function notAddingStaff() {
  isAddingStaff.value = false;
}

const confirmDelete = (id) => {
    console.log(id)
  idToDelete.value = id;

  showModal.value = true;
};

// Method to initiate editing a store
function editStore(item, index) {
  editingIndex.value = index;
  editableStaff.value = { ...item };
  console.log(editableStaff.value);
  //   {
  //     id: 1,
  //     name: 'Devansh Dhingra',
  //     email: 'mrdevdhingra@gmail.com',
  //     phone_number: '0894952382',
  //     stores: [
  //       { storeName: 'madhu garments', storeID: 1 },
  //       { storeName: 'africa', storeID: 3 }
  //     ]
  //   }
}

const isStoreChecked = (storeId) => {
  return editableStaff.value.stores.some((store) => store.storeID === storeId);
};

const handleStoreChange = (storeId) => {
  const storeIndex = editableStaff.value.stores.findIndex(
    (store) => store.storeID === storeId
  );
  if (storeIndex > -1) {
    // If store already in list, remove it
    editableStaff.value.stores.splice(storeIndex, 1);
  } else {
    // If store not in list, add it
    const storeToAdd = storesData.value.find((store) => store.id === storeId);
    if (storeToAdd) {
      editableStaff.value.stores.push({
        storeName: storeToAdd.name,
        storeID: storeToAdd.id,
      });
    }
  }
};

function cancelEdit() {
  editingIndex.value = -1;
}

let isEditDropdownVisible = ref({});

const toggleEditDropdown = (index) => {
  isEditDropdownVisible.value[index] = true;
};

const updateStaff = async () => {
  console.log(editableStaff.value);
  try {
    const { error: updateError } = await supabase
      .from("staff")
      .update({
        name: editableStaff.value.name,
        email: editableStaff.value.email,
        phone_number: editableStaff.value.phone_number,
      })
      .eq("id", editableStaff.value.id);

    if (updateError) throw updateError;
    const { error: deleteError } = await supabase
      .from("staffstores")
      .delete()
      .eq("staff_id", editableStaff.value.id);

    if (deleteError) throw deleteError;
    for (const storeId of editableStaff.value.stores) {
      console.log(storeId.storeID);
      await addToStaffStoresDB(editableStaff.value.id, storeId.storeID);
    }

    editingIndex.value = -1;
    editableStaff.value = {};
    await fetchStaffStores();
    combineStaffAndStoreData();
  } catch (error) {
    console.error("Error updating staff:", error);
  }
};
</script>
