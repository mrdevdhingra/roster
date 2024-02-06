<template>
  <div>
    <form @submit.prevent="register">
      <input placeholder="Your email" type="email" v-model="email" />
      <input placeholder="Your password" type="password" v-model="password" />
      <input type="submit" />
    </form>
    <NuxtLink to="/login">Login</NuxtLink>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth";
import { supabase } from "../supabase/supabase";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const register = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  console.log(data);

  if (error) {
    alert(error.message);
  } else {
    
      // Insert user data into the 'users' table
      const { error } = await supabase.from("users").insert(
        {
          email: data.user.email,
          user_id: data.user.id
        },
      );

      if (error) {
        console.log(error);
      }
    
  }

  authStore.setUser(data.user.email);
  router.push({ path: "/dashboard" });
};
</script>
