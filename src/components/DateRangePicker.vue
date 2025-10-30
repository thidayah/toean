<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { Icon } from "@iconify/vue"

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [null, null]
  },
  placeholderStart: {
    type: String,
    default: 'Start date'
  },
  placeholderEnd: {
    type: String,
    default: 'End date'
  }
})

const emit = defineEmits(['update:modelValue'])
const dateRange = ref(props.modelValue)

// Update to parent
watch(dateRange, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <div class="flex gap-3">
    <VueDatePicker v-model="dateRange" range :enable-time-picker="false" :text-input="true" :clearable="false"
      :input-class="'hidden'">
      <!-- Custom input field -->
      <template #dp-input="{ onFocus }">
        <div class="flex gap-3 w-full">
          <!-- Start date -->
          <div
            class="flex items-center justify-between border border-gray-200 text-sm rounded-md px-3 py-3 w-full text-gray-700 hover:border-gray-400 focus-within:border-blue-500 transition-all duration-150 cursor-pointer"
            @click="onFocus">
            <span class="text-gray-400" v-if="!dateRange?.[0]">{{ placeholderStart }}</span>
            <span v-else>
              {{ new Date(dateRange[0]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </span>
            <Icon icon="mdi:date-range" class="size-5 text-black" />
          </div>

          <!-- End date -->
          <div
            class="flex items-center justify-between border border-gray-200 text-sm rounded-md px-4 py-3 w-full text-gray-700 hover:border-gray-400 focus-within:border-blue-500 transition-all duration-150 cursor-pointer"
            @click="onFocus">
            <span class="text-gray-400" v-if="!dateRange?.[1]">{{ placeholderEnd }}</span>
            <span v-else>
              {{ new Date(dateRange[1]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </span>
            <Icon icon="mdi:date-range" class="size-5 text-black" />
          </div>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<style scoped>
/* Hide shadow existing */
.dp__input_wrap {
  box-shadow: none !important;
}
</style>
