<script setup>
import { ref, onMounted } from 'vue'
import { BaseButton, BaseTable, BaseInput, Drawer, BaseTitle, BaseAction, BaseSelect, BaseTextarea } from '@/components'
import { privacyHeaders } from "@/utils/columns"
import { dataPrivacy } from "@/utils/data"
import { toast } from "vue-sonner"

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
  description: '',
  type: '',
  sequence: '',
})

const typeOptions = [
  { label: 'Driver', value: 'driver' },
  { label: 'Customer', value: 'customer' },
]

const sequenceOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
]

const fetchPrivacy = async (params) => {
  try {
    // const { data, meta } = await apiGetPrivacy(params)
    const { data, meta } = dataPrivacy
    privacy.value = data
    pages.value = {
      current: meta.current_page,
      per: meta.per_page,
      last: meta.last_page,
      total: meta.total
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load data')
  } finally {
    isProcess.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchPrivacy({ page: pages.value.current, limit: pages.value.per })
    ])
  } finally {
    isLoading.value = false
  }
})

// Event handlers
const handleEdit = (item) => console.log('Edit action:', item)
const handleDelete = (item) => console.log('Delete action:', item)
const handlePageChange = (page) => {
  console.log('Page change action:', item)
}

const handleSave = () => {
  console.log('added:', form.value)
  isDrawerOpen.value = false
}

const cancelForm = () => {
  isDrawerOpen.value = false
  form.value = {
    id: null,
    title: '',
    description: '',
    type: '',
    sequence: '',
  }
}

</script>

<template>
  <div>
    <BaseTitle :title="title" />

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
            <BaseTextarea v-model="form.description" placeholder="Description" />
            <BaseSelect v-mode="form.type" :options="typeOptions" placeholder="Type" />
            <BaseSelect v-mode="form.sequence" :options="sequenceOptions" placeholder="Sequence" />
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