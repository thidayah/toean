<template>
  <Toaster position="top-center" richColors />
  <router-view />
</template>

<script setup>
  import { Toaster } from "vue-sonner";
</script>