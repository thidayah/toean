<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
      class="w-full border border-gray-200 rounded-md p-3 text-sm placeholder:text-gray-400 appearance-none pr-10 focus:outline-none focus:ring-1 focus:ring-[#1f438d] transition"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="(opt, index) in options"
        :key="index"
        :value="opt.value || opt"
      >
        {{ opt.label || opt }}
      </option>
    </select>

    <Icon
      icon="mdi:chevron-down"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
    />
  </div>
</template>
