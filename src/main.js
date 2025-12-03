import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { Toaster } from 'vue-sonner'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'vue-sonner/style.css'
import '@vuepic/vue-datepicker/dist/main.css'

// createApp(App).mount('#app')
const app = createApp(App)
app.use(router)
app.component('Toaster', Toaster)
app.component('QuillEditor', QuillEditor)
app.mount('#app')