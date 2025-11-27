<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  activeLabel: {
    type: String,
    default: "Active"
  },
  inactiveLabel: {
    type: String,
    default: "Inactive"
  }
});

const emit = defineEmits(["update:modelValue"]);

const toggle = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <div class="flex items-center gap-3 cursor-pointer" @click="toggle">
    <div
      class="w-11 h-6 flex items-center rounded-full transition-all"
      :class="modelValue ? 'bg-[#1f438d]' : 'bg-gray-300'"
    >
      <div
        class="w-5 h-5 bg-white rounded-full shadow transform transition-all"
        :class="modelValue ? 'translate-x-5' : 'translate-x-1'"
      ></div>
    </div>

    <span class="text-sm text-gray-700">
      {{ modelValue ? activeLabel : inactiveLabel }}
    </span>
  </div>
</template>
