import { createRouter, createWebHistory } from 'vue-router'
import { Layout } from "@/components"
import { getAuth } from "@/utils/auth"

import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Role from '@/views/user/Role.vue'
import UserList from '@/views/user/UserList.vue'
import Customer from "@/views/Customer.vue"
import Banner from "@/views/banner/Banner.vue"
import Walkthrough from "@/views/banner/Walkthrough.vue"

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
      { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: 'Dashboard | Toean' } },
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '/user/role', name: 'Role', component: Role, meta: { title: 'Role | Toean' } },
      { path: '/user/user-list', name: 'UserList', component: UserList, meta: { title: 'User List | Toean' } },
    ]
  },
  {
    path: '/customer',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '/customer', name: 'Customer', component: Customer, meta: { title: 'Customer | Toean' } },
    ]
  },
  {
    path: '/banner',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '/banner/banner', name: 'Banner', component: Banner, meta: { title: 'Banner | Toean' } },
      { path: '/banner/walkthrough', name: 'Walkthrough', component: Walkthrough, meta: { title: 'Walkthrough | Toean' } },
    ]
  },
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
