<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { BaseButton, BaseTable, BaseInput, Drawer, BaseTitle, BaseAction, BaseSelect, BaseUpload, DateRangePicker, BaseToggle } from '@/components'
import { bannerHeaders } from "@/utils/columns"
import { dataBanner, dataTypeOptions } from "@/utils/data"
import moment from "moment"
import { toast } from "vue-sonner"
import { apiDelBanner, apiGetBanners, apiPostBanner, apiPutBanner } from "@/api/banners"
import { handleError } from "@/utils"

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const banners = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const form = ref({
  id: null,
  title: '',
  link: '',
  image: '',
  type: '',
  startDate: '',
  endDate: '',
  active: false,
  dateRange: '',
})

const fetchData = async (params) => {
  try {
    const { data: { items, pagination } } = await apiGetBanners(params)
    banners.value = items
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
    const { message } = await apiPostBanner(form.value)
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
    const { message } = await apiPutBanner(form.value.id, form.value)
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
    const { message } = await apiDelBanner(id)
    toast.success(message || 'Deleted successfully!')
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
      fetchData({ page: pages.value.current, limit: pages.value.per })
    ])
  } finally {
    isLoading.value = false
  }
})

watchEffect(() => {
  if (form.value.dateRange && form.value.dateRange.length === 2) {
    form.value.startDate = moment(form.value.dateRange[0]).format('YYYY-MM-DD')
    form.value.endDate = moment(form.value.dateRange[1]).format('YYYY-MM-DD')
  } else {
    form.value.startDate = ''
    form.value.endDate = ''
  }
})

const handlePageChange = async (page) => {
  isProcess.value = true
  fetchData({ page: page, limit: pages.value.per })
}

const handleSave = () => !isEdit.value ? postData() : putData()

const handleEdit = (item) => {
  let sDate = moment(item.startDate).format('YYYY-MM-DD')
  let eDate = moment(item.endDate).format('YYYY-MM-DD')
  form.value = {
    id: item.id,
    title: item.title,
    link: item.link,
    image: item.image,
    type: item.type,
    active: item.active,
    sequence: item.sequence,
    startDate: sDate,
    endDate: eDate,
    dateRange: [sDate, eDate],
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
    link: '',
    image: '',
    type: '',
    startDate: '',
    endDate: '',
    active: false,
    dateRange: '',
  }
}

</script>

<template>
  <div>
    <BaseTitle title="Manage Banner" />

    <div class="flex items-center justify-between px-5 py-6 bg-white rounded-t-lg">
      <h2 class="font-medium text-lg text-gray-800">Banner</h2>
      <BaseButton @click="isDrawerOpen = true" variant="filled">
        Add New
      </BaseButton>
    </div>

    <BaseTable :loading="isLoading" :process="isProcess" :headers="bannerHeaders" :items="banners" :pagination="pages"
      @pageChange="handlePageChange">
      <!-- images -->
      <template #image="{ row }">
        <img :src="row.image" :alt="row.name" class="w-40 h-20 rounded object-cover">
      </template>

      <!-- type -->
      <template #type="{ row }">
        <p>{{ row.type === 1 ? 'Customer' : 'Driver' }}</p>
      </template>

      <!-- periode -->
      <template #periode="{ row }">
        <span>{{ moment(row.startDate).format('DD MMM YYYY') }} - {{ moment(row.endDate).format('DD MMM YYYY') }}</span>
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
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} Banner`" @onClose="handleCancel">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <!-- <div class="overflow-y-auto p-4 px-6"> -->
        <div class=" p-4 px-6">
          <!-- Browe Upload -->
          <BaseUpload v-model="form.image" accepted=".jpg, .jpeg, .png" class=" mb-4" />

          <!-- Input Fields -->
          <div class="space-y-3">
            <BaseInput v-model="form.title" placeholder="Title" />
            <BaseInput v-model="form.link" placeholder="Link" />
            <BaseSelect v-model="form.type" :options="dataTypeOptions" placeholder="Type" />
            <DateRangePicker v-model="form.dateRange" />
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