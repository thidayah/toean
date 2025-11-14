<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-5xl font-bold mb-4 text-[#1e2938]">404</h1>
    <p class="text-lg text-gray-600 mb-6">The page you are looking for was not found.</p>
    <RouterLink
      to="/"
      class="px-4 py-2 bg-[#1f438d] text-white rounded-md hover:bg-[#1f438d]/75 transition-colors duration-150"
    >
      Back to Dashboard
    </RouterLink>
  </div>
</template>
