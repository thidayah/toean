<script setup>
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { BaseTitle, BaseButton, BaseInput, BaseSelect, BaseTable, BaseAction, BadgeStatus, AvatarCircle, Drawer, BaseApproval } from "@/components";
import { driverListHeaders } from "@/utils/columns";
import { toast } from "vue-sonner";
import { apiGetDriverRegistrations, apiPostDriverApprove, apiPostDriverReject } from "@/api/driver";
import { handleError } from "@/utils";

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const drivers = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const filter = ref({
  search: '',
  status: ''
})
const form = ref({
  id: null,
})

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const fetchData = async (params) => {
  try {
    const { data: { items, pagination } } = await apiGetDriverRegistrations(params)
    drivers.value = items
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

const postAcceptData = async (id) => {
  isAction.value = true
  try {
    const { message } = await apiPostDriverApprove(id)
    toast.success(message || 'Accept successfully!')
    handleRefresh()
  } catch (error) {
    handleError(error)
  } finally {
    isAction.value = false
  }
}

const postRejectData = async (id, note) => {
  isAction.value = true
  try {
    const { message } = await apiPostDriverReject(id, { note })
    toast.success(message || 'Reject successfully!')
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

watch(
  () => [filter.value.status, filter.value.search],
  ([status, search]) => {
    fetchData({
      page: pages.value.current,
      limit: pages.value.per,
      search,
      approval_status: status === 'all' ? '' : status
    })
  },
  { immediate: true }
)

const handleApproval = (item, action) => {  
  if (confirm(`Are you sure to ${action} this driver?`)) {
    if (action === 'accept') {
      return postAcceptData(item.id)      
    } else {
      const note = window.prompt("Please enter your note");
      return postRejectData(item.id, note)
    }
  }  
}

const handleView = (item) => {
  form.value = { ...item }
  isDrawerOpen.value = true
}

const handleDelete = (item) => toast.success(`Soon! Delete driver: ${item.name}`)

const handlePageChange = (page) => {
  isProcess.value = true
  fetchData({ page: page, limit: pages.value.per })
}

const handleSearch = () => {
  isProcess.value = true
  fetchData({ page: pages.value.current, limit: pages.value.per, search: filter.value.search, approval_status: filter.value.status === 'all' ? '' : filter.value.status })
}

const handleRefresh = () => {
  fetchData({ page: pages.value.current, limit: pages.value.per })
  setTimeout(() => {
    isDrawerOpen.value = false
  }, 100);
}

const handleCancel = () => {
  isDrawerOpen.value = false
  form.value = {
    id: null,
  }
}

</script>

<template>
  <div>
    <BaseTitle title="Manage Driver" />

    <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-6 bg-white rounded-t-lg">
      <!-- Title -->
      <h2 class="font-medium text-lg text-gray-800">Driver List</h2>

      <!-- Right Section -->
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="flex items-center gap-2">
          <label class="font-medium text-sm text-gray-800">Search</label>
          <BaseInput v-model="filter.search" placeholder="Search.." v-on:onEnter="handleSearch" />
        </div>

        <!-- Status -->
        <div class="flex items-center gap-2">
          <label class="font-medium text-sm text-gray-800">Status</label>
          <BaseSelect v-model="filter.status" :options="statusOptions" placeholder="Status" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <BaseTable :loading="isLoading" :process="isProcess" :headers="driverListHeaders" :items="drivers"
      :pagination="pages" @pageChange="handlePageChange">

      <!-- photo -->
      <template #photo="{ row }">
        <AvatarCircle :url="row.selfie_image" />
      </template>

      <!-- status -->
      <template #status="{ row }">
        <BadgeStatus :status="row.approval_status" />
      </template>

      <!-- actions -->
      <template #actions="{ row, index }">
        <div :key="index" class="py-1 space-x-2 items-center flex justify-end">
          <BaseApproval
            v-if="row.approval_status === 'pending'"
            type="accept"
            @onAction="handleApproval(row, 'accept')"
          />
          <BaseApproval
            v-if="row.approval_status === 'pending'"
            type="reject"
            @onAction="handleApproval(row, 'reject')"
          />
          <BaseAction type="view" @onAction="handleView(row)" />
          <BaseAction type="delete" @onAction="handleDelete(row)" />
        </div>
      </template>
    </BaseTable>

    <!-- Drawer -->
    <Drawer v-model="isDrawerOpen" :title="`Detail Driver`" @onClose="handleCancel">
      <form class="flex flex-col h-full justify-between">
        <div class="overflow-y-auto p-4 px-6">
          <BaseTitle title="Driver Information" />
          <!-- Input Fields -->
          <div class="space-y-3">
            <div>
              <label class="text-[#979899] text-xs">Photo</label>
              <AvatarCircle :url="form.selfie_image" size=" size-20 mt-1" />
            </div>
            <div>
              <label class="text-[#979899] text-xs">Name</label>
              <p class="text-sm mt-1">{{ form.name }}</p>
            </div>
            <div>
              <label class="text-[#979899] text-xs">Registration ID</label>
              <p class="text-sm mt-1">{{ form.registration_id }}</p>
            </div> 
            <div>
              <label class="text-[#979899] text-xs">Phone Number</label>    
              <p class="text-sm mt-1">{{ form.phone_number }}</p>
            </div>
            <div>
              <label class="text-[#979899] text-xs">SIM Photo</label> 
              <p class="text-sm mt-1">{{ form.sim_image || '-' }}</p>
            </div>
            <div>
              <label class="text-[#979899] text-xs">Status</label>    
              <p :class="['text-sm mt-1 capitalize', form.approval_status === 'approved' ? 'text-green-500' : form.approval_status === 'pending' ? 'text-yellow-500' : 'text-red-500' ]">• {{ form.approval_status }}</p>
            </div>
            <div>
              <label class="text-[#979899] text-xs">Survery Status </label>    
              <p class="text-sm mt-1">{{ form.survey_status || '-'}}</p>
            </div>
            <div>
              <label class="text-[#979899] text-xs">Rejection Note</label>    
              <p class="text-sm mt-1">{{ form.rejection_note || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Button -->
        <div class="border-t border-[#e7e8e7] p-4 px-6 mt-auto flex justify-start gap-3">
          <BaseButton @click="handleCancel" variant="filled">
            Back
          </BaseButton>
        </div>
      </form>
    </Drawer>
  </div>
</template>