<script setup>
import { ref, onMounted } from 'vue'
import { BaseButton, BaseTable, BaseInput, Drawer, BaseTitle, BaseAction, BaseSelect, BaseTextarea } from '@/components'
import { aboutHeaders } from "@/utils/columns"
import { dataAbout } from "@/utils/data"
import { toast } from "vue-sonner"

const title = 'About Us'
const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const about = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const form = ref({
  id: null,
  title: '',
  description: '',
  type: '',
})

const typeOptions = [
  { label: 'Driver', value: 'driver' },
  { label: 'Customer', value: 'customer' },
]

const fetchAbout = async (params) => {
  try {
    // const { data, meta } = await apiGetAbout(params)
    const { data: { items, pagination } } = dataAbout
    about.value = items
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

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchAbout({ page: pages.value.current, limit: pages.value.per })
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
    <BaseTitle title="Settings" />

    <div class="flex items-center justify-between px-5 py-6 bg-white rounded-t-lg">
      <h2 class="font-medium text-lg text-gray-800">{{ title }}</h2>
      <BaseButton @click="isDrawerOpen = true" variant="filled">
        Add New
      </BaseButton>
    </div>

    <BaseTable :loading="isLoading" :process="isProcess" :headers="aboutHeaders" :items="about" :pagination="pages"
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