<script setup>
import { ref, watch } from 'vue'
import { toast } from "vue-sonner"

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  accepted: {
    type: String,
    default: '.jpg,.jpeg,.png'
  }
})

const emit = defineEmits(['update:modelValue'])
const file = ref(null)
const preview = ref(null)
const isDragging = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      file.value = null
      preview.value = null
      return
    }

    if (typeof val === "string") {      
      file.value = null
      preview.value = val
      return
    }

    if (val instanceof File) {
      file.value = val
      preview.value = URL.createObjectURL(val)
    }
  },
  { immediate: true }
)

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const droppedFile = e.dataTransfer.files[0]
  if (validateFile(droppedFile, props.accepted)) setFile(droppedFile)
}

const handleFileSelect = (e) => {
  const selectedFile = e.target.files[0]
  if (validateFile(selectedFile, props.accepted)) setFile(selectedFile)
}

const setFile = (f) => {
  file.value = f
  preview.value = URL.createObjectURL(f)
  emit('update:modelValue', f)
}

const removeFile = () => {
  file.value = null
  preview.value = null
  emit('update:modelValue', null)
}

const validateFile2 = (f, accept) => {
  const allowed = accept?.split(',').map(t => t.trim()) || ['.jpg', '.jpeg', '.png']
  const validTypes = allowed.map(ext => {
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
    if (ext === '.png') return 'image/png'
    if (ext === '.pdf') return 'application/pdf'
    return ''
  })

  if (!validTypes.includes(f.type)) {
    toast.warning(`Only ${allowed.join(', ')} files are supported`)
    toast.warning(`File type not supported. Allowed: ${accept}`)
    return false
  }

  return true
}

const validateFile = (f, accept = '.jpg,.jpeg,.png', maxSizeMB = 2) => {
  const allowedTypes = accept.split(',').map(t => t.trim()) || ['.jpg', '.jpeg', '.png']
  const validTypes = allowedTypes.map(ext => {
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
    if (ext === '.png') return 'image/png'
    if (ext === '.pdf') return 'application/pdf'
    if (ext === '.doc') return 'application/msword'
    if (ext === '.docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    return ''
  })

  // Validasi type
  if (!validTypes.includes(f.type)) {
    toast.warning(`File type not supported. Allowed: ${accept}`)
    return false
  }

  // Validasi file size (optional)
  const sizeMB = f.size / (1024 * 1024)
  if (sizeMB > maxSizeMB) {
    toast.warning(`File size must be less than ${maxSizeMB} MB`)
    return false
  }

  return true
}

</script>

<template>
  <div>
    <div class="w-full border border-dashed border-primary rounded-lg p-6 text-center transition-colors"
      :class="isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'"
      @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop="handleDrop">
      <!-- If not yet -->
      <div v-if="!file && !preview">
        <p class="text-gray-600 text-sm">Drag your image to start uploading</p>
        <p class="text-gray-400 my-1 text-sm">or</p>
        <label
          class="inline-block px-4 py-2 text-sm border border-primary text-primary rounded-md cursor-pointer hover:bg-blue-50 transition">
          Browse Files
          <input type="file" :accept="accepted" hidden @change="handleFileSelect" />
        </label>
      </div>

      <!-- If file exist -->
      <div v-else class="flex flex-col items-center space-y-3">
        <img v-if="['image/jpeg', 'image/png'].includes(file?.type)" :src="preview" alt="preview"
          class="max-h-48 rounded-md shadow-md object-contain" />
        <img v-else :src="preview" alt="preview"
          class="max-h-48 rounded-md shadow-md object-contain" />
        <p class="text-sm text-gray-700 font-medium">{{ file?.name }}</p>
        <button class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition cursor-pointer"
          @click="removeFile">
          Remove
        </button>
      </div>
    </div>
    <p class="text-xs text-gray-400 mt-1">*only support {{ accepted }}</p>
  </div>
</template>
