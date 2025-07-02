<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../../shared/stores/auth';
import { fetchFavoriteMovies } from '../../../shared/utils/ListFavorites';
import { removeMovieFromFavorites } from '../../../shared/utils/FavoriteService';
import { fetchGenres } from '../../../shared/utils/GenreService';

const route = useRoute();
const authStore = useAuthStore();

const movies = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const removalMessage = ref('');
const removalError = ref('');

const genres = ref<any[]>([]);
const selectedGenreIds = ref<number[]>([]);

const userId = authStore.user ? authStore.user.id : null;

const getImageUrl = (path: string | null, type: 'poster' | 'backdrop' = 'poster') => {
  if (!path) return 'https://via.placeholder.com/300x450?text=Sem+Poster';
  const baseUrl = type === 'backdrop' ? 'https://image.tmdb.org/t/p/original' : 'https://image.tmdb.org/t/p/w500';
  return `${baseUrl}${path}`;
};

const loadFavoriteMovies = async () => {
  loading.value = true;
  error.value = null;
  removalMessage.value = '';
  removalError.value = '';
  movies.value = [];

  if (!userId) {
    error.value = 'Você precisa estar logado para ver seus filmes favoritos.';
    loading.value = false;
    return;
  }

  try {
    const genresQueryParam = selectedGenreIds.value.length > 0
      ? selectedGenreIds.value.join(',')
      : null;

    const data = await fetchFavoriteMovies(userId, genresQueryParam);

    if (data && data.length > 0) {
      movies.value = data.map(favoriteItem => favoriteItem.movie_details);
    } else {
      movies.value = [];
      error.value = null;
    }
  } catch (err: any) {
    console.error('Erro ao carregar filmes favoritos:', err);
    error.value = err.message || 'Não foi possível carregar seus filmes favoritos.';
  } finally {
    loading.value = false;
  }
};

const handleRemoveFromFavorites = async (movieId: number, movieTitle: string) => {
  removalMessage.value = '';
  removalError.value = '';

  if (!userId) {
    removalError.value = 'Você precisa estar logado para remover filmes dos favoritos.';
    return;
  }

  try {
    await removeMovieFromFavorites(userId, movieId);
    removalMessage.value = `${movieTitle} removido dos favoritos com sucesso!`;
    await loadFavoriteMovies();
  } catch (err: any) {
    console.error('Erro ao remover dos favoritos:', err);
    removalError.value = err.message;
  } finally {
    setTimeout(() => {
      removalMessage.value = '';
      removalError.value = '';
    }, 3000);
  }
};

const loadGenres = async () => {
  try {
    genres.value = await fetchGenres();

  } catch (err) {
    console.error('Erro ao carregar gêneros:', err);

  }
};

onMounted(() => {
  loadGenres();
  loadFavoriteMovies();
});

watch(selectedGenreIds, () => {
  loadFavoriteMovies();
});

watch(
  () => route.query.genre_ids,
  (newGenreIds) => {
    if (newGenreIds) {
      selectedGenreIds.value = String(newGenreIds).split(',').map(Number).filter(id => !isNaN(id));
    } else {
      selectedGenreIds.value = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="mx-auto p-6 text-white home-page">
    <h1 class="text-3xl font-bold mb-6 text-center">Meus Filmes Favoritos</h1>

    <div class="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-3">Filtrar por Gênero:</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div v-for="genre in genres" :key="genre.id" class="flex items-center">
          <input
            type="checkbox"
            :id="`genre-${genre.id}`"
            :value="genre.id"
            v-model="selectedGenreIds"
            class="mr-2 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label :for="`genre-${genre.id}`" class="text-gray-300 text-sm">{{ genre.name }}</label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-lg loading-message">Carregando seus filmes favoritos...</div>
    <div v-else-if="error" class="text-center text-red-500 text-lg error-message">{{ error }}</div>
    <div v-else-if="!loading && !error && movies.length === 0" class="text-center text-lg no-results-message">Você ainda não tem filmes favoritos adicionados (ou não há filmes para o gênero selecionado).</div>

    <div v-if="removalMessage" class="text-center text-green-500 text-lg mt-4">{{ removalMessage }}</div>
    <div v-if="removalError" class="text-center text-red-500 text-lg mt-4">{{ removalError }}</div>

    <div v-else class="movies-grid-container">
      <div class="movies-list-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img :src="getImageUrl(movie.poster_path, 'poster')" :alt="movie.title" class="movie-poster" />
          <div class="movie-info">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <p class="movie-genres">
              {{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'Ano Desconhecido' }}
            </p>
            <button @click="handleRemoveFromFavorites(movie.id, movie.title)" class="remove-favorite-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M14.74 3l-.68 1.64A2.5 2.5 0 0110.15 3h3.7c.6 0 1.13.25 1.5.65L16.26 3zM12 21.35l-1.83-1.65C4.27 15.17 2 13 2 9.5 2 6.5 4.5 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.5 4 22 6.5 22 9.5c0 3.5-2.27 5.67-8.17 10.2L12 21.35z"/>
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 11.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 13l5.47 5.47a.75.75 0 11-1.06 1.06L12 14.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 13 5.47 7.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos globais (fundo, texto) */
.home-page {
  background-color: #000;
  color: #fff;
  font-family: Arial, sans-serif;
  min-height: calc(100vh - 64px);
}

.loading-message,
.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.5em;
  color: #ccc;
  background-color: #1a1a1a;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
}

.no-results-message {
  font-size: 1.5em;
  color: #ccc;
  margin-top: 40px;
}

.movies-grid-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.movies-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
}

.movie-card {
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.movie-info {
  padding: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.movie-title {
  font-size: 1.1em;
  margin-bottom: 5px;
  color: #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-genres {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 10px;
}

.remove-favorite-btn {
  background-color: #dc2626;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background-color 0.3s ease;
  margin-top: auto;
}

.remove-favorite-btn:hover {
  background-color: #ef4444;
}

.remove-favorite-btn svg {
  width: 18px;
  height: 18px;
}

@media (min-width: 640px) {
  .movies-list-grid {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (min-width: 768px) {
  .movies-list-grid {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }
}

@media (min-width: 1024px) {
  .movies-list-grid {
    grid-template-columns: repeat(4, minmax(200px, 1fr));
  }
}
</style>
