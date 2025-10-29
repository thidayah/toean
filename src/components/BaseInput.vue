<script setup>
import { Icon } from "@iconify/vue";
const props = defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  show: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'onShow'])
</script>

<template>
  <div class="relative">
    <input :type="type === 'password' ? show ? 'text' : 'password' : type" :placeholder="placeholder"
      :value="modelValue" @input="emit('update:modelValue', $event.target.value)"
      class="w-full border border-gray-200 rounded-md p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1f438d] transition" />
    <button v-if="type === 'password'" type="button" @click="emit('onShow')"
      class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
      <Icon :icon="show ? 'mdi:lock-open-outline' : 'mdi:lock-outline'" class="text-gray-600 size-5" />
    </button>
  </div>
</template>
