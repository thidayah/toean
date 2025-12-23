<script setup>
  import DefaultAvatar from '@/assets/DefaultAvatar.png'
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
  <img v-if="url" :src="url" alt="photo" :class="[` ${size} rounded-full object-cover `]" />
  <img v-else :src="DefaultAvatar" alt="default avatar" :class="[` ${size} rounded-full object-cover `]" />
</template>