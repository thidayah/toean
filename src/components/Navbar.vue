<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

// State
const openMenu = ref(null)
const route = useRoute()
const router = useRouter()

const menuData = ref([
  {
    title: 'Dashboard',
    icon: 'mdi:view-dashboard-outline',
    path: '/dashboard',
  },
  {
    title: 'Manage User',
    icon: 'mdi:account-group-outline',
    children: [
      { title: 'Role', path: '/user/role' },
      { title: 'User List', path: '/user/user-list' },
    ],
  },
  {
    title: 'Manage Customer',
    icon: 'mdi:account-circle-outline',
    path: '/customer',
  },
  {
    title: 'Manage Driver',
    icon: 'mdi:steering',
    children: [
      { title: 'Driver List', path: '/driver/list' },
      { title: 'Driver Area', path: '/driver/area' },
    ],
  },
  {
    title: 'Manage Payment',
    icon: 'mdi:credit-card-outline',
    path: '/payment',
  },
  {
    title: 'Settings',
    icon: 'mdi:cog-outline',
    children: [
      { title: 'General', path: '/setting/general' },
      { title: 'Security', path: '/setting/security' },
    ],
  },
])

// auto-detect current parent menu based on route
const currentParent = computed(() =>
  menuData.value.find(
    (m) =>
      m.children && m.children.some((c) => route.path.startsWith(c.path))
  ) || null
)

// watch route/currentParent and open submenu accordingly
watch(
  currentParent,
  (val) => {
    openMenu.value = val ? val.title : null
  },
  { immediate: true }
)

// Function navigasi & toggle
const toggleMenu = (title) => {
  openMenu.value = openMenu.value === title ? null : title
}
const goTo = async (path) => {
  if (!path) return
  await router.push(path)
  // after navigation ensure openMenu reflects new route
  const parent = menuData.value.find(
    (m) => m.children && m.children.some((c) => path.startsWith(c.path))
  )
  openMenu.value = parent ? parent.title : null
}
</script>

<template>
  <aside class="w-64 h-screen bg-[#f4f5fb] flex flex-col">
    <nav class="flex-1 px-0 py-3 overflow-y-auto space-y-2">
      <div v-for="menu in menuData" :key="menu.title" class="space-y-1">
        <!-- Menu utama -->
        <button
          @click="menu.children ? toggleMenu(menu.title) : goTo(menu.path)"
          :class="[
            'flex items-center justify-between w-full px-7 py-2 rounded-md text-sm font-medium transition',
            route.path === menu.path
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100 cursor-pointer',
          ]"
        >
          <div class="flex items-center">
            <Icon :icon="menu.icon" class="w-5 h-5 mr-3" />
            <span>{{ menu.title }}</span>
          </div>
          <Icon
            v-if="menu.children"
            icon="mdi:chevron-down"
            :class="[
              'size-5 transition-transform',
              openMenu === menu.title ? 'rotate-180' : '',
            ]"
          />
        </button>

        <!-- Submenu -->
        <transition name="fade">
          <div v-if="openMenu === menu.title" class="mt-1 space-y-1">
            <button
              v-for="sub in menu.children"
              :key="sub.title"
              @click="goTo(sub.path)"
              :class="[
                'flex items-center w-full px-3 py-2 rounded-md text-sm pl-8',
                route.path === sub.path
                  ? 'bg-[#1f438d] text-white rounded-r-full'
                  : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700 hover:rounded-r-full cursor-pointer',
              ]"
            >
              ○ &nbsp;&nbsp; {{ sub.title }}
            </button>
          </div>
        </transition>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
