<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { BaseTitle, BaseButton, BaseInput, BaseSelect, BaseTable, BaseAction, BadgeStatus, AvatarCircle, Drawer } from "@/components";
import { customerHeaders } from "@/utils/columns";
import { dataCustomer } from "@/utils/data";
import { toast } from "vue-sonner";

const isLoading = ref(false)
const isProcess = ref(false)
const isAction = ref(false)
const isEdit = ref(false)
const isDrawerOpen = ref(false)
const customers = ref([])
const pages = ref({ current: 1, per: 10, last: 0, total: 0 })
const filter = ref({
  search: '',
  status: 'all'
})
const form = ref({
  id: null,
  name: '',
  position: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  photo: null,
})

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const positionOptions = [
  { label: 'Developer', value: 'developer' },
  { label: 'Customer', value: 'customer' },
]

const fetchCustomer = async (params) => {
  try {
    // const { data, meta } = await apiGetCustomers(params)
    const { data, meta } = dataCustomer
    customers.value = data
    pages.value = {
      current: meta.current_page,
      per: meta.per_page,
      last: meta.last_page,
      total: meta.total
    }
  } catch (error) {
    toast.error(error?.message || 'Failed to load customers')
  } finally {
    isProcess.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      fetchCustomer({ page: pages.value.current, limit: pages.value.per })
    ])
  } finally {
    isLoading.value = false
  }
})

const handleAccept = (item) => console.log('Accept action:', item)
const handleReject = (item) => console.log('Reject action:', item)
const handleEdit = (item) => console.log('Edit action:', item)
const handleDelete = (item) => console.log('Delete action:', item)
const handlePageChange = (page) => {

}
</script>

<template>
  <div>
    <BaseTitle title="Manage Customer" />

    <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-6 bg-white rounded-t-lg">
      <!-- Title -->
      <h2 class="font-medium text-lg text-gray-800">Customer List</h2>

      <!-- Right Section -->
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="flex items-center gap-2">
          <label class="font-medium text-sm text-gray-800">Search</label>
          <BaseInput v-model="filter.search" placeholder="Search.." />
        </div>

        <!-- Status -->
        <div class="flex items-center gap-2">
          <label class="font-medium text-sm text-gray-800">Status</label>
          <BaseSelect v-model="filter.status" :options="statusOptions" placeholder="Role" />
        </div>

        <!-- Add Button -->
        <BaseButton @click="isDrawerOpen = true" variant="filled">
          Add New
        </BaseButton>
      </div>
    </div>

    <!-- Table -->
    <BaseTable :loading="isLoading" :process="isProcess" :headers="customerHeaders" :items="customers"
      :pagination="pages" @pageChange="handlePageChange">

      <!-- photo -->
      <template #photo="{ row }">
        <AvatarCircle :url="row.photo" />
      </template>

      <!-- status -->
      <template #status="{ row }">
        <BadgeStatus :status="row.status" />
      </template>

      <!-- actions -->
      <template #actions="{ row, index }">
        <div :key="index" class="py-1 space-x-2 items-center flex justify-end">
          <button v-if="row.status === 'Inactive'"
            class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition cursor-pointer"
            @click="handleAccept(row)">
            Accept
          </button>
          <button v-if="row.status === 'Inactive'"
            class="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition cursor-pointer"
            @click="handleReject(row)">
            Reject
          </button>

          <BaseAction type="edit" @onAction="handleEdit(row)" />
          <BaseAction type="delete" @onAction="handleDelete(row)" />
        </div>
      </template>
    </BaseTable>

    <!-- Drawer -->
    <Drawer v-model="isDrawerOpen" :title="`${isEdit ? 'Edit' : 'Add'} Customer`">
      <form @submit.prevent="handleSave" class="flex flex-col h-full justify-between">
        <div class="overflow-y-auto p-4 px-6">
          <!-- Avatar Upload -->
          <div class="flex justify-left mb-6">
            <label for="photo-upload"
              class="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <Icon icon="mdi:plus" class="text-[#1f438d] w-6 h-6" />
              <input id="photo-upload" type="file" class="hidden"
                @change="(e) => (userForm.photo = e.target.files[0])" />
            </label>
          </div>

          <!-- Input Fields -->
          <div class="space-y-3">
            <BaseInput v-model="form.name" placeholder="Name" />
            <BaseSelect v-model="form.position" :options="positionOptions" placeholder="Position" />
            <BaseSelect v-model="form.gender" :options="genderOptions" placeholder="Gender" />
            <BaseInput v-model="form.email" type="email" placeholder="Email" />
            <BaseInput v-model="form.phone" placeholder="Phone" />
            <BaseTextarea v-model="form.address" placeholder="Alamat" rows="4" />
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