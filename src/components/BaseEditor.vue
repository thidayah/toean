<script setup>
import { QuillEditor } from '@vueup/vue-quill'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write something...'
  }
})

const emit = defineEmits(['update:modelValue'])

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ header: [1, 2, 3, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean']
]

const onChange = (content) => {
  emit('update:modelValue', content)
}
</script>

<template>
  <div class=" border-gray-300 overflow-hidden">
    <QuillEditor
      theme="snow"
      :content="modelValue"
      contentType="html"
      :toolbar="toolbar"
      :placeholder="placeholder"
      @update:content="onChange"
      class="min-h-[150px]"
    />
  </div>
</template>
