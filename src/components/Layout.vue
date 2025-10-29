<script setup>
import { Header, Navbar } from ".";
</script>

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
