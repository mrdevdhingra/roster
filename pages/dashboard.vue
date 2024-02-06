<template>
  <nav class="bg-gray-50">
    <div class="flex py-2 container mx-auto">
      <div class="flex-grow">
        <h1 class="text-2xl text-blue-900">Roster</h1>
      </div>
      <div class="flex gap-2">
        <!-- <h1>
          {{ user.email }}
        </h1> -->
        <div class="relative">
          <button
            class="bg-blue-700 text-white px-3 py-1 rounded-sm"
            @click="checkNotification"
          >
            Requests
          </button>
          <div
            v-if="checkNot"
            class="absolute -bottom-10 z-10 mt-6 bg-gray-100 w-56 px-2 py-1"
          >
            <div v-if="requestsData.length > 0">
              <div
                v-for="request in requestsData"
                :key="request.workspace.name"
                class="flex"
              >
              <h1 class="flex-grow">
                {{ request.workspace.name }}
              </h1>
                
                <button class=" text-blue-700 pr-2" @click="acceptRequest(request.workspace_id)">
                  Accept
                </button>
                <button class=" text-red-700  " @click="deleteRequest(request.workspace_id)">
                  Delete
                </button>
              </div>
            </div>

            <div v-else>No workspaces found.</div>
          </div>
        </div>

        <button
          class="bg-blue-700 text-white px-3 py-1 rounded-sm"
          @click="logout"
        >
          Log out
        </button>
      </div>
    </div>
  </nav>

  <div class="flex-row flex w-screen">
    <div class="w-1/6 bg-gray-100 h-screen">
      <h1>ok</h1>
    </div>

    <div class="w-5/6 pl-10 pt-6">
      <div v-if="selectedWorkspace" class="flex items-center">
        <h1 class="text-lg">Current workspace:</h1>
        <div>
          <select v-model="selectedWorkspace">
            <option
              v-for="workspace in workspaces"
              :key="workspace.workspace.name"
              :value="workspace.workspace.name"
            >
              <h1 class="text-2xl">
                {{ workspace.workspace.name }}
              </h1>
            </option>
          </select>
        </div>
      </div>
      <div v-if="!selectedWorkspace">
        <h1 class="text-3xl font-bold">You have no workspaces</h1>
        <h1>Create a workspace:</h1>
        <form @submit.prevent="createWorkspace">
          <input
            type="text"
            placeholder="enter workspace name"
            v-model="workspace_name"
          />
          <input type="submit" placeholder="submit" />
        </form>
      </div>
    </div>
  </div>

  <div class="h-screen"></div>

  <div class="h-screen">
    <div v-for="user in workspaceUsers">
      {{ user.users.email }}
    </div>

    <div></div>

    <form @submit.prevent="addToWorkspace">
      <input type="email" placeholder="add to workspace" v-model="addNew" />
      <input type="submit" placeholder="submit" />
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

import { useAuthStore } from "~/store/auth";
import { supabase } from "../supabase/supabase";
const authStore = useAuthStore();
const user = authStore.user;
const router = useRouter();
const workspace_name = ref("");
const addNew = ref("");
let workspaces = computed({
  get() {
    return authStore.workspaces;
  },
});
const selectedWorkspace = ref(authStore.currentWorkspace);

let checkNot = ref(false);

function checkNotification() {
  checkNot.value = !checkNot.value;
  console.log(checkNot);
}
watch(workspaces, (oldVal, newVal) => {
  console.log("change in val");
  //workspaces = newVal;
});

const updateCurrentWorkspace = () => {
  authStore.setCurrentWorkspace(selectedWorkspace.value);
};

watch(selectedWorkspace, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    updateCurrentWorkspace();
    fetchWorkspaceUsers();
  }
});

const deleteRequest = async (workspace_id) => {
  console.log("called to delete", workspace_id);
  const { error } = await supabase
    .from("pending")
    .delete()
    .eq("workspace_id", workspace_id)
    .eq("user_email", user.email);
  console.log(error);
};

const acceptRequest = async (workspace_id) => {
  //remove from pending

  const { error } = await supabase
    .from("pending")
    .delete()
    .eq("workspace_id", workspace_id)
    .eq("user_email", user.email);
  //add to workspace users
  const add_workspace_user = await supabase
    .from("workspace_users")
    .insert({ workspace_id: workspace_id, user_id: user.id });
  if (add_workspace_user.error) {
    alert(add_workspace_user.error);
  }
  //call get workspaces
  await getUserWorkspaces(user.id);
};

const channels = supabase
  .channel("insert_in_pending")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "pending" },
    (payload) => {
      fetchRequests();
      fetchWorkspaceUsers();
      console.log("Change received!", payload);
    }
  )
  .subscribe();

const requestsData = ref([]); // Use a ref to store the requests data

async function fetchRequests() {
  const { data, error } = await supabase
    .from("pending")
    .select(`workspace(name),workspace_id`)
    .eq("user_email", user.email);

  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    console.log(data);
    requestsData.value = data;
  }
}

let workspaceUsers = ref([]);

async function fetchWorkspaceUsers() {
  const { data, error } = await supabase
    .from("workspace")
    .select()
    .eq("name", selectedWorkspace.value);

  if (data) {
    console.log(data);
  }

  if (error) {
    console.log(error);
  }

  const users = await supabase
    .from("workspace_users")
    .select(`users(email))`)
    .eq("workspace_id", data[0].id);

  //console.log(users.data)
  workspaceUsers.value = users.data;
}

// Call fetchRequests when the component is mounted or when user.email changes
onMounted(fetchRequests);
onMounted(fetchWorkspaceUsers);

const logout = async () => {
  await supabase.auth.signOut();
  authStore.setUser(null);
  authStore.setWorkspaces(null);
  authStore.setCurrentWorkspace(null);

  supabase.removeChannel(channels);
  router.push({ path: "/login" });
};

const addToWorkspace = async () => {
  const user = await supabase
    .from("users")
    .select("user_id")
    .eq("email", addNew.value);
  console.log(user.data, user.error);
  const workspace_id = await supabase
    .from("workspace")
    .select("id")
    .eq("name", selectedWorkspace.value);
  console.log(selectedWorkspace.value, workspace_id.data[0].id);

  const { error } = await supabase.from("pending").insert({
    user_email: addNew.value,
    workspace_id: workspace_id.data[0].id,
  });
};

const createWorkspace = async () => {
  //Add workspace to 'workspace' DB
  const { error } = await supabase
    .from("workspace")
    .insert({ name: workspace_name.value, created_by: user.id });
  //Get workspace from 'workspace' db to get workspace id
  const { data } = await supabase
    .from("workspace")
    .select()
    .eq("created_by", user.id)
    .eq("name", workspace_name.value);
  //Add user to workspace_user in 'workspace_user' db
  const error_workspace_user = await supabase
    .from("workspace_users")
    .insert({ workspace_id: data[0].id, user_id: user.id });
  if (error_workspace_user.error) {
    alert(error_workspace_user);
  }
  if (error) {
    alert(error.message);
  }
  await getUserWorkspaces(user.id);
};

const getUserWorkspaces = async (id) => {
  const { data, error } = await supabase
    .from("workspace_users")
    .select(`workspace(name)`)
    .eq("user_id", authStore.user.id);
  if (data) {
    authStore.setWorkspaces(data);
    workspaces = authStore.workspaces;
  }
  if (error) {
    console.log(error);
  }
};
</script>
