<script setup>
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Lock, LockOpen } from 'lucide-vue-next'
import { useRouter } from "vue-router"

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const router = useRouter()

const showPassword = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)


const validateForm = () => {
  if (!form.email.trim()) {
    toast.warning('Email cannot be empty')
    return false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.email)) {
    toast.warning('Invalid email format')
    return false
  }

  if (!form.password.trim()) {
    toast.warning('Password cannot be empty')
    return false
  }

  return true
}

const onSubmit = () => {
  if (!validateForm()) return
  toast.success('Login successful!')
  router.push('/dashboard')
  console.log('Form Data:', form)
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between items-center bg-[#1e3e8a]">
    <!-- Content -->
    <div class="flex-1 flex justify-center items-center w-full">
      <div class="bg-white p-10 rounded-2xl w-[400px] shadow-xl text-center">
        <img src="@/assets/Logo.svg" alt="Toean Logo" class="w-40 mx-auto mb-8" />

        <h2 class="text-xl font-semibold mb-1 text-left">Welcome to Toean!</h2>
        <p class="text-gray-500 text-sm mb-8 text-left">
          Make your app management easy and fun.
        </p>

        <form @submit.prevent="onSubmit" class="space-y-5 text-left">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-300"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="Password"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 placeholder:text-gray-300"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                <component
                  :is="showPassword ? LockOpen : Lock"
                  class="text-gray-600 size-5"
                />
              </button>
            </div>
          </div>

          <!-- Remember -->
          <div class="flex items-center">
            <input
              id="remember"
              type="checkbox"
              v-model="form.remember"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 text-sm text-gray-700">Remember me</label>
          </div>

          <!-- Button -->
          <button
            type="submit"
            class="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition font-medium "
          >
            Login
          </button>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-white text-xs mb-4">
      © 2025 All Reserved by Toean - Tukang Antar
    </footer>
  </div>
</template>

