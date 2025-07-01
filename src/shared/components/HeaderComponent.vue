<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="flex flex-col  text-white">

    <header class="bg-gray-800 p-4 shadow-lg flex justify-between items-center w-full">
      <h1 class="text-2xl font-bold">Cine Art</h1>
      <nav>
        <RouterLink to="/favorites" class="mr-4 hover:text-blue-400">Meus Favoritos</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md">Sair</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="mr-4 hover:text-blue-400">Login</RouterLink>
          <RouterLink to="/register" class="hover:text-blue-400">Cadastrar</RouterLink>
        </template>
      </nav>
    </header>

  </div>
</template>

<style scoped>

</style>
