<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMoviesSearch } from '@/shared/utils/SearchMoviesService.js';
import { addMovieToFavorites } from '@/shared/utils/FavoriteService.js';
import { useAuthStore } from '@/shared/stores/auth.js';

const route = useRoute();
const movies = ref([]);
const loading = ref(false);
const error = ref(null);
const noResults = ref(false);
const favoriteMessage = ref('');
const favoriteError = ref('');

const authStore = useAuthStore();

const userId = authStore.user ? authStore.user.id : null;

const getImageUrl = (path, type = 'poster') => {
  if (!path) return 'https://via.placeholder.com/300x450?text=Sem+Poster'; // Fallback para poster
  const baseUrl = type === 'backdrop' ? 'https://image.tmdb.org/t/p/original' : 'https://image.tmdb.org/t/p/w500';
  return `${baseUrl}${path}`;
};

const fetchSearchResults = async (query) => {
  loading.value = true;
  error.value = null;
  noResults.value = false;
  movies.value = [];

  if (!query) {
    loading.value = false;
    return;
  }

  try {
    const data = await fetchMoviesSearch(query);
    if (data && data.length > 0) {
      movies.value = data;
    } else {
      noResults.value = true;
    }
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    error.value = err.message || 'Não foi possível carregar os filmes. Tente novamente mais tarde.';
  } finally {
    loading.value = false;
  }
};

const handleAddToFavorites = async (movie) => {
  favoriteMessage.value = '';
  favoriteError.value = '';

  if (!userId) {
    favoriteError.value = 'Você precisa estar logado para adicionar filmes aos favoritos.';
    return;
  }

  const movieDataToSend = {
    movie_id: movie.id,
    movie_details: {
      adult: movie.adult,
      backdrop_path: movie.backdrop_path,
      genre_ids: movie.genre_ids,
      id: movie.id,
      original_language: movie.original_language,
      original_title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      title: movie.title,
      video: movie.video,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      posterUrl: movie.posterUrl,
      releaseDate: movie.releaseDate
    }
  };

  try {
    await addMovieToFavorites(userId, movieDataToSend);
    favoriteMessage.value = `${movie.title} adicionado aos favoritos com sucesso!`;
  } catch (err) {
    console.error('Erro ao adicionar aos favoritos:', err);
    favoriteError.value = err.message;
  } finally {
    setTimeout(() => {
      favoriteMessage.value = '';
      favoriteError.value = '';
    }, 3000);
  }
};

watch(
  () => route.query.query,
  (newQuery) => {
    fetchSearchResults(newQuery);
  },
  { immediate: true }
);

</script>

<template>
  <div class="mx-auto p-6 text-white home-page">
    <h2 class="text-3xl font-bold mb-6 text-center">Resultados da Busca para "{{ route.query.query }}"</h2>

    <div v-if="loading" class="text-center text-lg loading-message">Carregando filmes...</div>
    <div v-else-if="error" class="text-center text-red-500 text-lg error-message">{{ error }}</div>
    <div v-else-if="noResults" class="text-center text-lg">Nenhum filme encontrado para "{{ route.query.query }}".</div>

    <div v-if="favoriteMessage" class="text-center text-green-500 text-lg mt-4">{{ favoriteMessage }}</div>
    <div v-if="favoriteError" class="text-center text-red-500 text-lg mt-4">{{ favoriteError }}</div>

    <div v-else class="movies-grid-container">
      <div class="movies-list-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img :src="getImageUrl(movie.posterUrl || movie.poster_path, 'poster')" :alt="movie.title" class="movie-poster" />
          <div class="movie-info">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <p class="movie-genres">
              {{ movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.release_date ? movie.release_date.substring(0, 4) : 'Ano Desconhecido') }}
            </p>
            <button @click="handleAddToFavorites(movie)" class="add-to-favorites-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 21.35l-1.83-1.65C4.27 15.17 2 13 2 9.5 2 6.5 4.5 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.5 4 22 6.5 22 9.5c0 3.5-2.27 5.67-8.17 10.2L12 21.35z"/>
              </svg>
              Favoritar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (Seus estilos CSS permanecem inalterados) */
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

.add-to-favorites-btn {
  background-color: #e50914;
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

.add-to-favorites-btn:hover {
  background-color: #f40612;
}

.add-to-favorites-btn svg {
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
