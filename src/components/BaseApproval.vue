<script setup>
defineProps({
  type: {
    type: String,
    default: 'accept'
  },
  status: {
    type: String,
    default: 'pending'
  }
})
</script>

<template>
  <button
    @click="$emit('onAction')"
    :class="[
      'text-xs px-4 py-2 rounded-md  transition cursor-pointer capitalize',
      type === 'accept'
        ? 'bg-green-50 text-green-500 hover:bg-green-100'
        : 'bg-red-50 text-red-500 hover:bg-red-100'
    ]"
    >
    {{ type }}
  </button>
</template>