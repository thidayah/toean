<script setup>
// import { defineProps, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  actions: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => ({
      current: 1,
      total: 3,
    }),
  },
})

const emit = defineEmits(['edit', 'delete', 'pageChange'])

const handleEdit = (item) => emit('edit', item)

const handleDelete = (item) => emit('delete', item)
const changePage = (page) => emit('pageChange', page)
</script>

<template>
  <div class="bg-white rounded-lg shadow-xl">
    <!-- Table -->
    <table class="w-full text-sm text-left text-gray-700">
      <thead class="bg-gray-100 text-[#979899] uppercase text-xs">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            class="px-6 py-5 font-medium"
          >
            {{ header.label }}
          </th>

          <th
            v-if="actions"
            class="px-6 py-4 text-right font-medium"
          >
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          class="border-b border-[#E8E8E8] hover:bg-gray-50"
        >
          <td
            v-for="(header, i) in headers"
            :key="i"
            class="px-6 py-3"
          >
            <!-- Special cell rendering -->
            <template v-if="header.key === 'photo'">
              <img
                :src="item[header.key]"
                alt="photo"
                class="w-8 h-8 rounded-full object-cover"
              />
            </template>

            <template v-else-if="header.key === 'status'">
              <span
                class="inline-flex items-center text-green-600 font-medium"
              >
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {{ item[header.key] }}
              </span>
            </template>

            <template v-else>
              {{ item[header.key] }}
            </template>
          </td>

          <td v-if="actions" class="px-6 py-3 text-right space-x-2">
            <button
              @click="handleEdit(item)"
              class="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 cursor-pointer"
            >
              <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete(item)"
              class="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 cursor-pointer"
            >
              <Icon icon="mdi:trash-can-outline" class="w-4 h-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div
      class="flex items-center justify-end gap-2 px-6 py-4 text-sm rounded-b-lg"
    >
      <button
        class="px-3 py-2 border border-[#E9E9E9] rounded-md hover:bg-gray-100 flex items-center cursor-pointer"
        @click="changePage(pagination.current - 1)"
        :disabled="pagination.current === 1"
      >
        <Icon icon="mdi:chevron-left" class="size-5 mr-1" /> Kembali
      </button>

      <button
        v-for="page in pagination.total"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-3 py-2 border border-[#E9E9E9] rounded-md',
          pagination.current === page
            ? 'bg-[#1f438d] text-white'
            : 'hover:bg-gray-100 cursor-pointer',
        ]"
      >
        {{ page }}
      </button>

      <button
        class="px-3 py-2 border border-[#E9E9E9] rounded-md hover:bg-gray-100 flex items-center cursor-pointer"
        @click="changePage(pagination.current + 1)"
        :disabled="pagination.current === pagination.total"
      >
        Selanjutnya <Icon icon="mdi:chevron-right" class="size-5 ml-1" />
      </button>
    </div>
  </div>
</template>
