<template>
  <div>
    <form @submit.prevent="login">
      <input placeholder="Your email" type="email" v-model="email" />
      <input placeholder="Your password" type="password" v-model="password" />
      <input type="submit" />
    </form>
    <NuxtLink to="/register">Register</NuxtLink>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth";
import { supabase } from "../supabase/supabase";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert(error);
  }

  authStore.setUser(data.user);
  await getUserWorkspaces(data.user.id);
  router.push({ path: "/home" });
};

const getUserWorkspaces = async (id) => {
  const { data, error } = await supabase
    .from("workspace_users")
    .select(`workspace(name,id)`)
    .eq("user_id", authStore.user.id);
  if (data) {
    //alert(data);
    authStore.setWorkspaces(data);
    console.log(data[0].workspace.name);//workspace name
    console.log(data[0].workspace.id);//workspace id
    authStore.setCurrentWorkspace(data[0].workspace.name);
    console.log(authStore.currentWorkspace);
  }
  if(error){
    console.log(error);
  }
};
</script>
