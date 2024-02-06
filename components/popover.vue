<template>
  <div>
    <div class="relative w-20 h-10">
      <button
        @dblclick="toggleShow"
        class="bg-gray-200 w-full h-full rounded-lg"
      >{{ name }}</button>
      <div
        class="absolute bg-gray-700 w-[200%] rounded-lg px-4 py-4 bottom-[105%] left-1/2 -translate-x-1/2"
        v-if="show"
      >
        <form class="flex w-full bg-gray-700 gap-2">
          <input
            type="text"
            class="w-1/2 px-2 py-1 rounded-lg"
            placeholder="from"
            v-model="fromTime"
          />
          <span class="text-white">:</span>
          <input
            type="text"
            class="w-1/2 px-2 py-1 rounded-lg"
            placeholder="to"
            v-model="toTime"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  Name: { type: String, required: true },
});
const name = computed(() => {
  return props.Name;
});
const show = ref(false);
const fromTime = ref("");
const toTime = ref("");
function toggleShow() {
  show.value = !show.value;
  console.log("clicked");
}
</script>
