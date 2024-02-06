<template>
  <div class="container mx-auto">
    <h1 className="text-2xl font-bold mb-4">Timetable</h1>

    <div class="flex justify-end mb-4">
      <button
        @click="changeWeek(-1)"
        class="px-3 py-1 rounded mr-2 text-white bg-blue-600"
      >
        &lt;
      </button>
      <button
        @click="changeWeek(1)"
        class="px-3 py-1 rounded text-white bg-blue-600"
      >
        &gt;
      </button>
    </div>

    <div class="rounded-lg border border-gray-200">
      <table
        class="min-w-full rounded-lg bg-white text-sm divide-y-2 divide-gray-200"
      >
        <thead class="bg-gray-100 rounded text-left">
          <tr>
            <th
              class="py-2 px-4 w-1/6 font-normal border-r border-gray-200 rounded-tl-lg"
            >
              Day
            </th>
            <th class="py-2 px-4 w-1 font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, index) in days" :key="index">
            <td class="py-2 px-4 border-r border-gray-200 hover:bg-gray-200">
              <div>{{ day.name }}</div>
              <div class="text-xs text-gray-500">{{ day.dateStr }}</div>
            </td>
            <td class="py-2 px-4"><draggableRow /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import draggableRow from "~/components/draggableRow.vue";

const weekOffset = ref(0);
const days = ref([]);

const getWeekDays = (offset) => {
  const result = [];
  const startOfWeek = new Date();
  startOfWeek.setDate(
    startOfWeek.getDate() - startOfWeek.getDay() + 1 + offset * 7
  );

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    result.push({
      name: day.toLocaleDateString("en-US", { weekday: "long" }),
      dateStr: day.toLocaleDateString(),
    });
  }

  return result;
};

watchEffect(() => {
  days.value = getWeekDays(weekOffset.value);
});

const changeWeek = (direction) => {
  weekOffset.value += direction;
};
</script>

<style>
/* Add your Tailwind CSS styles here */
</style>
