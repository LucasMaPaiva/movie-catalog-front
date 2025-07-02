import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './shared/services/router'

import { useAuthStore } from '@/shared/stores/auth';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore();

authStore.initializeAuth();

app.use(router)

app.mount('#app')
