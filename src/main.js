import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

// createApp(App).mount('#app')
const app = createApp(App)
app.use(router)
app.component('Toaster', Toaster)
app.mount('#app')