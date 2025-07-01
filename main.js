import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/shared/services/router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

import { useAuthStore } from '@/stores/auth.js';
const authStore = useAuthStore();
authStore.initializeAuth();

app.use(router)

app.mount('#app')
