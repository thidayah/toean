<script setup>
import { onMounted, ref } from 'vue'
// import { Icon } from '@iconify/vue'
import { BaseTable, Drawer, BaseInput, BaseSelect, BaseTextarea, BaseButton, BaseTitle, BaseAction } from '@/components'
import { userListHeaders } from "@/utils/columns"
import { apiDelUser, apiGetUsers, apiPostUser, apiPutUser } from "@/api/users"
import { toast } from "vue-sonner"
import { apiGetRoles } from "@/api/roles"
import { handleError } from "@/utils"

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const isShowPassword = ref(false)
const users = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const roles = ref([])
const userForm = ref({
  id: null,
  fullName: '',
  email: '',
  password: '',
  roleId: null,
  // position: '',
  // role: '',
  // phone: '',
  // gender: '',
  // address: '',
  // photo: null,
})

const togglePassword = () => (isShowPassword.value = !isShowPassword.value)

const fetchUsers = async (params) => {
  try {
    const { data: { items, pagination } } = await apiGetUsers(params)
    // users.value = items.map(r => ({ ...r, role: r.role?.RoleName }))
    users.value = items.map(r => ({ ...r, role: r.roleId }))
    pages.value = {
      current: pagination.page,
      per: pagination.limit,
      last: pagination.totalPage,
      total: pagination.total
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load users')
  } finally {
    isProcess.value = false
  }
}

const fetchRoles = async (params) => {
  try {
    const { data: { items } } = await apiGetRoles(params)
    roles.value = items.map(r => ({ ...r, value: r.id, label: r.name }))
  } catch (error) {
    toast.error(error?.message || 'Failed to load roles')
  }
}

const postUser = async () => {  
  isAction.value = true
  try {
    const { message } = await apiPostUser({ ...userForm.value, roleId: parseInt(userForm.value.roleId) })
    toast.success(message || 'User added successfully!')
    handleRefresh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const putUser = async () => {
  isAction.value = true
  try {
    const { message } = await apiPutUser(userForm.value.id, { ...userForm.value, roleId: parseInt(userForm.value.roleId) })
    toast.success(message || 'User updated successfully!')
    handleRefresh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const delUser = async (id) => {
  isAction.value = true
  try {
    const { message } = await apiDelUser(id)
    toast.success(message || 'User deleted successfully!')
    handleRefresh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchUsers({ page: pages.value.current, limit: pages.value.per }),
      fetchRoles({ page: 1, limit: 100 }),
    ])
  } finally {
    isLoading.value = false
  }
})

const handlePageChange = async (page) => {
  isProcess.value = true
  fetchUsers({ page: page, limit: pages.value.per })
}

const handleSave = ()  => !isEdit.value ? postUser() : putUser()

const handleEdit = (item) => {
  userForm.value = {
    id: item.id,
    fullName: item.fullName,
    email: item.email,
    roleId: item.roleId,
  }
  isEdit.value = true
  isDrawerOpen.value = true
}

const handleDelete = (item) => {
  if (confirm('Are you sure to delete this item?')) {
    delUser(item.id)
  }
}

const handleRefresh = () => {
  fetchUsers({ page: pages.value.current, limit: pages.value.per })
  setTimeout(() => {
    isDrawerOpen.value = false
  }, 100);
}

const handleCancel = () => {
  isDrawerOpen.value = false
  userForm.value = {
    fullName: '',
    email: '',
    password: '',
    roleId: '',
    // position: '',
    // role: '',
    // phone: '',
    // gender: '',
    // address: '',
    // photo: null,
  }
}

// const positionOptions = [
//   { label: 'Staff', value: 'staff' },
//   { label: 'Manager', value: 'manager' },
// ]

// const roleOptions = [
//   { label: 'User', value: 'user' },
//   { label: 'Admin', value: 'admin' },
// ]

// const genderOptions = [
//   { label: 'Laki-laki', value: 'male' },
//   { label: 'Perempuan', value: 'female' },
// ]

</script>

<template>
  <div>
    <BaseTitle title="Manage User" />

    <div class="flex items-center justify-between px-5 py-6 bg-white rounded-t-lg">
      <h2 class="font-medium text-lg text-gray-800">User List</h2>
      <BaseButton @click="isDrawerOpen = true" variant="filled">
        Add New
      </BaseButton>
    </div>

    <!-- Table -->
    <BaseTable :loading="isLoading" :process="isProcess" :headers="userListHeaders" :items="users" :pagination="pages"
      @pageChange="handlePageChange">
      <!-- actions -->
      <template #actions="{ row, index }">
        <div :key="index" class="py-1 space-x-2 items-center flex justify-end">
          <BaseAction type="edit" @onAction="handleEdit(row)" />
          <BaseAction type="delete" @onAction="handleDelete(row)" />
        </div>
      </template>
    </BaseTable>

    <!-- Drawer -->
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} User`">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <div class="overflow-y-auto p-4 px-6">
          <!-- Avatar Upload -->
          <!-- <div class="flex justify-left mb-6">
            <label for="photo-upload"
              class="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <Icon icon="mdi:plus" class="text-[#1f438d] w-6 h-6" />
              <input id="photo-upload" type="file" class="hidden"
                @change="(e) => (userForm.photo = e.target.files[0])" />
            </label>
          </div> -->

          <!-- Input Fields -->
          <div class="space-y-3">
            <!-- <BaseInput v-model="userForm.name" placeholder="Name" />
            <BaseSelect v-model="userForm.position" :options="positionOptions" placeholder="Position" />
            <BaseSelect v-model="userForm.role" :options="roleOptions" placeholder="Role" />
            <BaseInput v-model="userForm.email" type="email" placeholder="Email" />
            <BaseInput v-model="userForm.phone" placeholder="Handphone" />
            <BaseSelect v-model="userForm.gender" :options="genderOptions" placeholder="Jenis Kelamin" />
            <BaseTextarea v-model="userForm.address" placeholder="Alamat" rows="4" /> -->
            <BaseInput v-model="userForm.fullName" placeholder="Name" />
            <BaseInput v-model="userForm.email" type="email" placeholder="Email" />
            <BaseInput v-model="userForm.password" type="password" placeholder="Password" :show="isShowPassword"
              @onShow="togglePassword" />
            <BaseSelect v-model="userForm.roleId" :options="roles" placeholder="Role" />
          </div>
        </div>

        <!-- Footer Button -->
        <div class="border-t border-[#e7e8e7] p-4 px-6 mt-auto flex justify-start gap-3">
          <BaseButton type="submit" variant="filled">
            Save
          </BaseButton>
          <BaseButton @click="handleCancel" variant="outline">
            Cancel
          </BaseButton>
        </div>
      </form>
    </Drawer>
  </div>
</template>
