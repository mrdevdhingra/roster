<template>
    <nav class="bg-gray-50">
        
        <div class="flex py-2 container mx-auto items-center gap-6">
            
            <div class="flex-grow">
        <h1 class="text-2xl text-blue-900">Roster</h1>
      </div>
        </div>

    </nav>
    <div class="container mx-auto pt-4">
        <NuxtLink to="/home" class="bg-gray-100 py-1 px-2 rounded-md">
            Back to workspaces
        </NuxtLink>
      <h1>Workspace: {{ workspaceId }}</h1>
      <store :workspace_id="workspaceId" />
      <staff :workspace_id="workspaceId"/>
      <popover :Name="'dev'" />
      <!-- <timetable/> -->
      <schedular/>
      <div class="h-[50vh]"></div>

      <!-- <draggableRow/> -->
      <!-- Workspace details here -->

      
    </div>
  </template>
  
  <script setup>
  import staff from '~/components/staff.vue';
  import store from '~/components/store.vue';
  import popover from '~/components/popover.vue';
  import draggableRow from '~/components/draggableRow.vue';
  import timetable from '~/components/timetable.vue';
  import schedular from '~/components/schedular.vue';
  definePageMeta({
  middleware: "auth",
});
  const route = useRoute();
  const workspaceId = parseInt(route.params.id);
  </script>
  