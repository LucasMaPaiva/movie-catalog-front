<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const searchQuery = ref('');

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'searchResults', query: { query: searchQuery.value.trim() } });
    searchQuery.value = '';
  }
};

const goToHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="flex flex-col text-white">
    <header class="bg-gray-800 p-4 shadow-lg flex justify-between items-center w-full">
      <h1
        class="text-2xl font-bold cursor-pointer transition-colors duration-200 hover:text-blue-400"
        @click="goToHome"
      >
        Cine Art
      </h1>

      <nav class="flex items-center gap-x-4">
        <div class="flex items-center">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="Buscar filmes..."
            class="p-2 rounded-l-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] w-auto md:w-48"
          />
          <button
            @click="handleSearch"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md transition-colors duration-200 whitespace-nowrap"
          >
            Buscar
          </button>
        </div>

        <RouterLink
          to="/favorites"
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap"
        >
          Meus Favoritos
        </RouterLink>

        <template v-if="authStore.isAuthenticated">
          <button
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap"
          >
            Sair
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap"
          >
            Cadastrar
          </RouterLink>
        </template>
      </nav>
    </header>
  </div>
</template>


<style scoped>
</style>
