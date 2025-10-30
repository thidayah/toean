<script setup>

const props = defineProps({
  title: String
})
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
  </div>
</template>