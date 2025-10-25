<template>
  <Header />
  <div class="flex h-screen z-0">
    <Navbar />
    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto px-8 py-4 bg-[#f4f5fb]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
  import Header from "@/components/Header.vue";
  import Navbar from '@/components/Navbar.vue'
</script>