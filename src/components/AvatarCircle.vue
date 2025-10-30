<script setup>
  defineProps({
    size: {
      type: String,
      default: 'size-8'
    },
    url: {
      type: String,
      default: ''
    }

  })
</script>

<template>
  <img :src="url" alt="photo" :class="[` ${size} rounded-full object-cover `]" />
</template>