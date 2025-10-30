<script setup>
defineProps({
  status: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <span :class="[
    'inline-flex items-center font-medium',
    status === 'Active' ? 'text-green-500' : 'text-red-500'
  ]">
    <span :class="[
      'w-2 h-2 rounded-full mr-2',
      status === 'Active' ? 'bg-green-500' : 'bg-red-500'
    ]"></span>
    {{ status }}
  </span>
</template>