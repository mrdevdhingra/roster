<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Timetable</h1>

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
              v-for="(day, index) in days"
              :key="index"
              class="py-2 px-4 w-1/7 font-normal border-r border-gray-200"
            >
              {{ day.name }}<br />
              <span class="text-xs text-gray-500">{{ day.dateStr }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="(day, index) in days"
              :key="index"
              class="py-2 px-4 border-r border-gray-200"
            >
              <div v-if="getScheduleForDay(day.dateStr) !== 'undefined'">
                <ul>
                  <draggableRow :Name="getScheduleForDay(day.dateStr)" />
                </ul>
              </div>
              <div v-else>No schedule</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import draggableRow from "~/components/draggableRow.vue";
import { supabase } from "~/supabase/supabase";

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
let staffs = ref([]);
const fetchSchedule = async () => {
  const { data, error } = await supabase.from("schedule").select("*");

  if (!error) {
    staffs.value = data;
    console.log(data[0].schedule);
    //  { '22/01/2024': [ 1, 9 ], '23/01/2024': [ 1 ], '24/01/2024': [ 9 ] }
  } else {
    console.error(error);
  }
};

fetchSchedule();
const getScheduleForDay = (dateStr) => {
  return staffs.value[0]?.schedule[dateStr] || [];
};

const staffNames = ref({});

const fetchAllStaffNames = async () => {
  const { data, error } = await supabase.from("staff").select("id, name");

  if (data) {
    const namesMap = {};
    data.forEach((staff) => {
      namesMap[staff.id] = staff.name;
    });
    staffNames.value = namesMap;
  } else if (error) {
    console.error(error);
  }
};

fetchAllStaffNames();
</script>
