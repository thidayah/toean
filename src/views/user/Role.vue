<script setup>
import { ref, onMounted, reactive } from 'vue'
import { BaseButton, BaseTable, BaseInput, Drawer, PermissionGroup, BaseTitle, BaseAction } from '@/components'
import { rolesHeaders } from "@/utils/columns"
import { apiGetRoles } from "@/api/roles"

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const isShowPassword = ref(false)
const roles = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const form = ref({
  id: null,
  name: '',
})

const rolePermissions = ref([
  {
    title: 'Manage User',
    permissions: { view: false, create: false, update: false, delete: false },
  },
  {
    title: 'Manage Customer',
    permissions: { view: false, create: false, update: false, delete: false },
  },
  {
    title: 'Manage Driver',
    permissions: { view: false, create: false, update: false, delete: false },
  },
  {
    title: 'Manage Banner',
    permissions: { view: false, create: false, update: false, delete: false },
  },
])

const fetchRoles = async (params) => {
  try {
    const { data, meta } = await apiGetRoles(params)
    roles.value = data
    pages.value = {
      current: meta.current_page,
      per: meta.per_page,
      last: meta.last_page,
      total: meta.total
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load roles')
  } finally {
    isProcess.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchRoles({ page: pages.value.current, limit: pages.value.per })
    ])
  } finally {
    isLoading.value = false
  }
})

// Event handlers
const handleEdit = (item) => console.log('Edit action:', item)
const handleDelete = (item) => console.log('Delete action:', item)
const handlePageChange = (page) => {

}

const handleSave = () => {
  console.log('User added:', form.value)
  console.log('Permissions:', rolePermissions.value)
  isDrawerOpen.value = false
}

const cancelForm = () => {
  isDrawerOpen.value = false
  form.value = {
    name: '',
  }
}

</script>

<template>
  <div>
    <BaseTitle title="Manage User" />

    <div class="flex items-center justify-between px-5 py-6 bg-white rounded-t-lg">
      <h2 class="font-medium text-lg text-gray-800">Role</h2>
      <BaseButton @click="isDrawerOpen = true" variant="filled">
        Add New
      </BaseButton>
    </div>

    <BaseTable :loading="isLoading" :process="isProcess" :headers="rolesHeaders" :items="roles" :pagination="pages" @pageChange="handlePageChange">
      <!-- actions -->
      <template #actions="{ row, index }">
        <div :key="index" class="py-1 space-x-2 items-center flex justify-end">
          <BaseAction type="edit" @onAction="handleEdit(row)" />
          <BaseAction type="delete" @onAction="handleDelete(row)" />
        </div>
      </template>
    </BaseTable>

    <!-- Drawer -->
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} Role`">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <div class="overflow-y-auto p-4 px-6">

          <!-- Input Fields -->
          <div class="space-y-3">
            <BaseInput v-model="form.name" placeholder="Name" />
            <PermissionGroup v-for="role in rolePermissions" v-model="role.permissions" :title="role.title" />
          </div>

        </div>

        <!-- Footer Button -->
        <div class="border-t border-[#e7e8e7] p-4 px-6 mt-auto flex justify-start gap-3">
          <BaseButton type="submit" variant="filled">
            Save
          </BaseButton>
          <BaseButton @click="cancelForm" variant="outline">
            Cancel
          </BaseButton>
        </div>
      </form>
    </Drawer>
  </div>
</template>