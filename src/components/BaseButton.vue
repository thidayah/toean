<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'filled' // 'filled' | 'outline'
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <button
    :type="type"
    :class="[
      'w-24 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer',
      variant === 'filled'
        ? 'bg-[#1f438d] text-white hover:bg-[#1f438d]/75'
        : 'border border-[#1f438d] text-[#1f438d] hover:bg-blue-50',
      customClass
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>


