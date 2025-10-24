import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/components/Layout.vue"

import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Role from '@/views/user/Role.vue'
import UserList from '@/views/user/UserList.vue'
import { getAuth } from "@/utils/auth"

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { title: 'Login | Toean', requiresAuth: false },
  },
  {
    path: '/dashboard',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '/user/role', name: 'Role', component: Role },
      { path: '/user/user-list', name: 'UserList', component: UserList, meta: { title: 'User List | Toean' }, },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  if (to.meta.requiresAuth && !auth) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && auth) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Toean'
})

export default router
