<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  title: String,
  modelValue: {
    type: Object,
    default: () => ({ view: false, create: false, update: false, delete: false }),
  },
})

const emit = defineEmits(['update:modelValue'])

const permissions = {
  view: 'View',
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
}

const localValue = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => Object.assign(localValue, val)
)

const emitChange = () => {
  emit('update:modelValue', { ...localValue })
}
</script>

<template>
  <div class="border rounded-lg p-4 space-y-3 border-gray-200">
    <h3 class="font-semibold text-gray-800">{{ title }}</h3>

    <div
      v-for="(label, key) in permissions"
      :key="key"
      class="flex items-center justify-between"
    >
      <span class="text-gray-700 capitalize">{{ label }}</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          v-model="localValue[key]"
          @change="emitChange"
        />
        <div
          class="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors"
        ></div>
        <div
          class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"
        ></div>
      </label>
    </div>
  </div>
</template>


