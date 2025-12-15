<script setup>
import { ref, onMounted } from 'vue'
import { BaseButton, BaseTable, BaseInput, Drawer, PermissionGroup, BaseTitle, BaseAction, BaseTextarea } from '@/components'
import { rolesHeaders } from "@/utils/columns"
import { apiDelRole, apiGetRoles, apiPostRole, apiPutRole } from "@/api/roles"
import { toast } from "vue-sonner"
import { handleError } from "@/utils"

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const roles = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const form = ref({
  id: null,
  name: '',
  description: '',
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
    const { data: { items, pagination } } = await apiGetRoles(params)
    roles.value = items
    pages.value = {
      current: pagination.page,
      per: pagination.limit,
      last: pagination.totalPage,
      total: pagination.total
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load roles')
  } finally {
    isProcess.value = false
  }
}

const postRole = async () => {
  isAction.value = true
  try {
    const { message } = await apiPostRole(form.value)
    toast.success(message || 'Role added successfully!')
    handleRefersh()
  } catch (error) {
    handleError(error)    
  } finally {
    isAction.value = false
  }
}

const putRole = async () => {
  isAction.value = true
  try {
    const { message } = await apiPutRole(form.value.id, form.value)
    toast.success(message || 'Role updated successfully!')
    handleRefersh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const delRole = async (id) => {
  isAction.value = true
  try {
    const { message } = await apiDelRole(id)
    toast.success(message || 'Role deleted successfully!')
    handleRefersh()
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
      fetchRoles({ page: pages.value.current, limit: pages.value.per })
    ])
  } finally {
    isLoading.value = false
  }
})

const handlePageChange = async (page) => {
  isProcess.value = true
  fetchRoles({ page: page, limit: pages.value.per })
}

const handleSave = () => !isEdit.value ? postRole() : putRole()

const handleEdit = (item) => {
  form.value = {
    id: item.id,
    name: item.name,
    description: item.description,
  }
  isEdit.value = true
  isDrawerOpen.value = true
}

const handleDelete = (item) => {
  if (confirm('Are you sure to delete this item?')) {
    delRole(item.id)
  }
}

const handleRefersh = () => {
  fetchRoles({ page: pages.value.current, limit: pages.value.per })
  setTimeout(() => {
    isDrawerOpen.value = false
  }, 100);
}

const handleCancel = () => {
  isDrawerOpen.value = false
  isEdit.value = false
  form.value = {
    name: '',
    description: '',
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

    <BaseTable :loading="isLoading" :process="isProcess" :headers="rolesHeaders" :items="roles" :pagination="pages"
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
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} Role`" @onClose="handleCancel">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <div class="overflow-y-auto p-4 px-6">

          <!-- Input Fields -->
          <div class="space-y-3">
            <BaseInput v-model="form.name" placeholder="Name" />
            <BaseTextarea v-model="form.description" placeholder="Description" />
            <!-- <PermissionGroup v-for="role in rolePermissions" v-model="role.permissions" :title="role.title" /> -->
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