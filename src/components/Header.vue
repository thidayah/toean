<script setup>
import Logo from '@/assets/Logo.svg'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { clearAuth } from "@/utils/auth"
import { useRouter } from "vue-router"

const router = useRouter()

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleMyAccount = () => {
  console.log('Go to My Account')
  showDropdown.value = false
}

const handleLogout = () => {
  clearAuth()
  router.push('/')
  showDropdown.value = false
}

</script>

<template>
  <header class="flex items-center flex-row bg-[#f4f5fb] px-6 py-3 ">
    <!-- Left: Logo -->
    <div class="flex items-center space-x-2 w-64">
      <img :src="Logo" alt="Toean Logo" class="h-6" />
    </div>

    <div class=" flex w-full flex-row justify-between">
      <!-- Center: Search -->
      <div class="relative max-w-md mx-6 hidden md:block w-full">
        <Icon
          icon="mdi:search"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-6"
        />
        <input 
          type="text" 
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <!-- Right: Notification + Avatar -->
      <div class="flex items-center space-x-4 relative">
        <!-- Notification -->
        <Icon icon="mdi:bell-outline" class="w-5 h-5 text-gray-700 cursor-pointer" />

        <!-- Avatar with dropdown -->
        <div class="relative">
          <img src="https://i.pravatar.cc/100?img=5" alt="User Avatar"
            class="w-9 h-9 rounded-full object-cover border border-gray-300 cursor-pointer" @click="toggleDropdown" />
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>

          <!-- Dropdown -->
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <div v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <button @click="handleMyAccount"
                class="w-full flex items-center gap-2 px-4 py-2 pt-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
                <Icon icon="mdi:account" class="w-5 h-5" />
                <span>My Account</span>
              </button>

              <button @click="handleLogout"
                class="w-full flex items-center gap-2 px-4 py-2 pb-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
                <Icon icon="mdi:logout" class="w-5 h-5 text-red-500" />
                <span class="text-red-500">Logout</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>
