<template>
  <div class="flex items-center justify-center min-h-screen">
  <div class="bg-gray-700 p-8 rounded-lg shadow-xl max-w-md">
    <h2 class="text-3xl font-bold mb-6 text-center">Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="email" class="block text-gray-300 text-sm font-bold mb-2">Email</label>
        <input type="email" id="email" v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200" placeholder="seuemail@exemplo.com">
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-300 text-sm font-bold mb-2">Senha</label>
        <input type="password" id="password" v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200" placeholder="********">
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Entrar
        </button>
        <router-link to="/register" class="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-600">
          Criar conta
        </router-link>
      </div>
    </form>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/shared/stores/auth.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleSubmit = async () => {

  await authStore.login(email.value, password.value);
  if (authStore.isAuthenticated) {
    router.push({ name: 'home' });
  } else {

    alert('Erro ao fazer login. Verifique suas credenciais.');
  }
};
</script>

<style scoped>
</style>
