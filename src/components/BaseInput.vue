<script setup>
const props = defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    class="w-full border border-gray-200 rounded-md p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1f438d] transition"
  />
</template>
