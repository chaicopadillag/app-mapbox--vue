import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

if (!navigator.geolocation) {
  alert('Geolocation is not supported by your browser')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
