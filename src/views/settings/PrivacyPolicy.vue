<script setup>
import { ref, onMounted, computed } from 'vue'
import { BaseButton, BaseTable, BaseInput, Drawer, BaseTitle, BaseAction, BaseSelect, BaseTextarea } from '@/components'
import { privacyHeaders } from "@/utils/columns"
import { toast } from "vue-sonner"
import { apiDelPrivacy, apiGetPrivacy, apiPostPrivacy, apiPutPrivacy } from "@/api/privacy"
import { handleError } from "@/utils"

const title = 'Privacy Policy'
const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const privacy = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const form = ref({
  id: null,
  title: '',
  content: '',
  type: '',
  sequence: '',
})

const typeOptions = [
  { label: 'Driver', value: 'driver' },
  { label: 'Customer', value: 'customer' },
]

const fetchData = async (params) => {
  try {
    const { data: { items, pagination } } = await apiGetPrivacy(params)
    privacy.value = items
     pages.value = {
      current: pagination.page,
      per: pagination.limit,
      last: pagination.totalPage,
      total: pagination.total
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load data')
  } finally {
    isProcess.value = false
  }
}

const postData = async () => {
  isAction.value = true
  try {
    const { message } = await apiPostPrivacy({ ...form.value, position: parseInt(form.value.position) })
    toast.success(message || 'Added successfully!')
    handleRefersh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const putData = async () => {
  isAction.value = true
  try {
    const { message } = await apiPutPrivacy(form.value.id, { ...form.value, position: parseInt(form.value.position) })
    toast.success(message || 'Updated successfully!')
    handleRefersh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const delData = async (id) => {
  isAction.value = true
  try {
    const { message } = await apiDelPrivacy(id)
    toast.success(message || 'Deleted successfully!')
    handleRefersh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const sequenceOptions = computed(() => {
  const total = pages.value.total || 0
  const length = total + 1
  return Array.from({ length }, (_, i) => ({
    label: `Sequence ${i + 1}`,
    value: i + 1
  }))
})

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchData({ page: pages.value.current, limit: pages.value.per })
    ])
  } finally {
    isLoading.value = false
  }
})

const handlePageChange = async (page) => {
  isProcess.value = true
  fetchData({ page: page, limit: pages.value.per })
}

const handleSave = () => !isEdit.value ? postData() : putData()

const handleEdit = (item) => {
  form.value = {
    id: item.id,
    title: item.title,
    content: item.content,
    type: item.type,
    position: item.position,
  }
  isEdit.value = true
  isDrawerOpen.value = true
}

const handleDelete = (item) => {
  if (confirm('Are you sure to delete this item?')) {
    delData(item.id)
  }
}

const handleRefersh = () => {
  fetchData({ page: pages.value.current, limit: pages.value.per })
  setTimeout(() => {
    isDrawerOpen.value = false
  }, 100);
}

const handleCancel = () => {
  isDrawerOpen.value = false
  form.value = {
    id: null,
    title: '',
    content: '',
    type: '',
    position: '',
  }
}
</script>

<template>
  <div>
    <BaseTitle title="Settings" />

    <div class="flex items-center justify-between px-5 py-6 bg-white rounded-t-lg">
      <h2 class="font-medium text-lg text-gray-800">{{ title }}</h2>
      <BaseButton @click="isDrawerOpen = true" variant="filled">
        Add New
      </BaseButton>
    </div>

    <BaseTable :loading="isLoading" :process="isProcess" :headers="privacyHeaders" :items="privacy" :pagination="pages"
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
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} ${title}`">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <div class=" p-4 px-6">
          <!-- Input Fields -->
          <div class="space-y-3">
            <BaseInput v-model="form.title" placeholder="Name" />
            <BaseTextarea v-model="form.content" placeholder="Description" />
            <BaseSelect v-mode="form.type" :options="typeOptions" placeholder="Type" />
            <BaseSelect v-mode="form.sequence" :options="sequenceOptions" placeholder="Sequence" />
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