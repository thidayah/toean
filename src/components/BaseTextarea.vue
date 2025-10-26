<script setup>
const props = defineProps({
  modelValue: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 3,
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    :rows="rows"
    :placeholder="placeholder"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    class="w-full border border-gray-200 rounded-md p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1f438d] transition "
  />
</template>
