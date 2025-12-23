<script setup>
defineProps({
  status: {
    type: String,
    default: ''
  }
})
</script>

<!-- approval_status: pending, approved, rejected -->
<template>
  <span :class="[
    'inline-flex items-center font-medium capitalize',
    status === 'approved' ? 'text-green-500' : status === 'pending' ? 'text-yellow-500' : 'text-red-500'
  ]">
    <span :class="[
      'w-2 h-2 rounded-full mr-2 ',
      status === 'approved' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
    ]"></span>
    {{ status }}
  </span>
</template>