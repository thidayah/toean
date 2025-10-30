<script setup>
import { Icon } from "@iconify/vue";
defineProps({
  type: {
    type: String,
    default: 'edit'
  }
})
</script>

<template>
  <button
    @click.stop="$emit('onAction')"
    :class="[
      'p-2 rounded-md transition cursor-pointer',
      type === 'edit'
        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
        : 'text-red-600 bg-red-50 hover:bg-red-100'
    ]"
  >
    <Icon
      :icon="type === 'edit' ? 'mdi:pencil-outline' : 'mdi:trash-can-outline'"
      class="w-4 h-4"
    />
  </button>
</template>
