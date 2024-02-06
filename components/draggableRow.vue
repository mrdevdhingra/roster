<template>
  <draggable
    v-model="props.Name"
    group="people"
    @start="drag = true"
    @end="drag = false"
    item-key="id"
  >
    <template #item="{ element }">
      <div class=" text-white px-2 py-1 w-16">
        <popover :Name="element" />
       
    </div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from "vuedraggable";
import popover from '~/components/popover.vue';
const props = defineProps({
  Name: { type: Array, required: true },
});
</script>
