<script setup>
defineProps({
  title: {
    type: String,
    default: 'Drawer'
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

// const emit = defineEmits(['update:modelValue', 'click'])
const emit = defineEmits(['onClose'])
const closeDrawer = () => {
  // emit('update:modelValue', false)
  emit('onClose')
}

</script>

<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="modelValue"
      @click="closeDrawer"
      class="fixed inset-0 bg-black/35 z-40"
    ></div>
  </transition>

  <!-- Drawer -->
  <transition name="slide">
    <aside
      v-if="modelValue"
      class="fixed top-0 right-0 w-[350px] h-full bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 px-6 border-b border-[#e7e8e7]">
        <!-- <slot name="header"> -->
          <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
        <!-- </slot> -->
        <button
          @click="closeDrawer"
          class="p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </aside>
  </transition>
</template>

<style scoped>
/* Fade (overlay) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide (drawer) */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
