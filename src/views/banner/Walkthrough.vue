<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue'
import { BaseButton, BaseTable, BaseInput, BaseSelect, Drawer, BaseTitle, BaseAction, BaseUpload, BaseTextarea, BaseToggle } from '@/components'
import { walkthroughHeaders } from "@/utils/columns"
import { dataTypeOptions } from "@/utils/data"
import { toast } from "vue-sonner"
import { apiDelWalkthrough, apiGetWalkthroughs, apiPostWalkthrough, apiPutWalkthrough } from "@/api/walkthrough"
import { handleError } from "@/utils"

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const walkthroughs = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const form = ref({
  id: null,
  title: '',
  description: '',
  image: null,
  type: '',
  active: false,
  sequence: '',
})

const fetchData = async (params) => {
  try {
    const { data: { items, pagination } } = await apiGetWalkthroughs(params)
    // const { data, meta } = dataWalkthrough
    walkthroughs.value = items
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
    const { message } = await apiPostWalkthrough(form.value)
    toast.success(message || 'Added successfully!')
    handleRefresh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const putData = async () => {
  isAction.value = true
  try {
    const { message } = await apiPutWalkthrough(form.value.id, form.value)
    toast.success(message || 'Updated successfully!')
    handleRefresh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const delData = async (id) => {
  isAction.value = true
  try {
    const { message } = await apiDelWalkthrough(id)
    toast.success(message || 'Deleted successfully!')
    handleRefresh()
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
    description: item.description,
    image: item.image,
    type: item.type,
    active: item.active,
    sequence: item.sequence,
  }
  isEdit.value = true
  isDrawerOpen.value = true
}

const handleDelete = (item) => {
  if (confirm('Are you sure to delete this item?')) {
    delData(item.id)
  }
}

const handleRefresh = () => {
  fetchData({ page: pages.value.current, limit: pages.value.per })
  setTimeout(() => {
    isDrawerOpen.value = false
  }, 100);
}

const handleCancel = () => {
  isDrawerOpen.value = false
  isEdit.value = false
  form.value = {
    id: null,
    title: '',
    description: '',
    image: '',
    type: '',
    active: false,
    sequence: '',
  }
}

</script>

<template>
  <div>
    <BaseTitle title="Manage Banner" />

    <div class="flex items-center justify-between px-5 py-6 bg-white rounded-t-lg">
      <h2 class="font-medium text-lg text-gray-800">Walkthrough</h2>
      <BaseButton @click="isDrawerOpen = true" variant="filled">
        Add New
      </BaseButton>
    </div>

    <BaseTable :loading="isLoading" :process="isProcess" :headers="walkthroughHeaders" :items="walkthroughs"
      :pagination="pages" @pageChange="handlePageChange">
      <!-- images -->
      <template #image="{ row }">
        <img :src="row.image" :alt="row.name" class="w-24 h-40 rounded object-cover">
      </template>

      <!-- type -->
      <template #type="{ row }">
        <p>{{ row.type === 1 ? 'Customer' : 'Driver' }}</p>
      </template>

      <!-- actions -->
      <template #actions="{ row, index }">
        <div :key="index" class="py-1 space-x-2 items-center flex justify-end">
          <BaseAction type="edit" @onAction="handleEdit(row)" />
          <BaseAction type="delete" @onAction="handleDelete(row)" />
        </div>
      </template>
    </BaseTable>

    <!-- Drawer -->
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} Walkthrough`" @onClose="handleCancel">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <div class="overflow-y-auto p-4 px-6">
          <!-- Browe Upload -->
          <BaseUpload v-model="form.image" accepted=".jpg, .jpeg, .png" class=" mb-4" />
          <!-- <BaseUpload v-model="form.image" :accepted="'.jpg,.png,.pdf'" /> -->


          <!-- Input Fields -->
          <div class="space-y-3">
            <BaseInput v-model="form.title" placeholder="Title" />
            <BaseTextarea v-model="form.description" placeholder="Description" />
            <BaseSelect v-model="form.type" :options="dataTypeOptions" placeholder="Type" />
            <BaseSelect v-model="form.sequence" :options="sequenceOptions" placeholder="Sequence" />
            <BaseToggle v-model="form.active" active-label="Active" inactive-label="Inactive" />
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