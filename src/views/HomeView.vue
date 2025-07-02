<script setup>
import { ref, onMounted } from 'vue';
import { fetchMovies } from '@/shared/utils/ListFilms.js';
import { fetchTopRated } from '@/shared/utils/ListFilmsTopRated.js';

const movies = ref([]);
const topRated = ref([]);
const errorMessage = ref(null);
const isLoading = ref(true);

const moviesListRef = ref(null);
const topRatedListRef = ref(null);

const featuredMovie = ref(null);

const fetchLatestMovies = async () => {
  try {
    const data = await fetchMovies();
    movies.value = data.results || [];
    if (!featuredMovie.value && movies.value.length > 0) {
      featuredMovie.value = movies.value[0];
    }
  } catch (error) {
    errorMessage.value = error.message;
    console.error("Erro ao carregar filmes populares:", error);
  }
};

const fetchTopMovies = async () => {
  try {
    const data = await fetchTopRated();
    topRated.value = data.results || [];
  } catch (error) {
    errorMessage.value = error.message;
    console.error("Erro ao carregar filmes de melhores avaliações:", error);
  }
};

onMounted(async () => {
  await Promise.all([fetchLatestMovies(), fetchTopMovies()]).finally(() => {
    isLoading.value = false;
  });
});


const getImageUrl = (path, type = 'poster') => {
  if (!path) return '';
  const baseUrl = type === 'backdrop' ? 'https://image.tmdb.org/t/p/original' : 'https://image.tmdb.org/t/p/w500';
  return `${baseUrl}${path}`;
};

const formatRuntime = (minutes) => {
  if (!minutes) return 'Duração desconhecida';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes} min`;
};


const scrollCarousel = (listRef, direction) => {
  if (listRef && listRef.value) {
    const scrollAmount = listRef.value.clientWidth * 0.7;
    if (direction === 'next') {
      listRef.value.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    } else {
      listRef.value.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }
};

const scrollPopularMovies = (direction) => scrollCarousel(moviesListRef, direction);
const scrollTopRatedMovies = (direction) => scrollCarousel(topRatedListRef, direction);

</script>

<template>
  <div class="home-page">
    <div v-if="isLoading" class="loading-full-screen">
      Carregando...
    </div>

    <div v-else-if="errorMessage" class="error-full-screen">
      {{ errorMessage }}
    </div>

    <div v-else-if="featuredMovie" class="main-banner"
         :style="{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%), url(' + getImageUrl(featuredMovie.backdrop_path, 'backdrop') + ')' }">
      <div class="banner-content">
        <p class="banner-year">{{ featuredMovie.release_date ? featuredMovie.release_date.substring(0, 4) : '' }}</p>
        <h1 class="banner-title">{{ featuredMovie.title }}</h1>
        <p class="banner-meta">
          {{ formatRuntime(featuredMovie.runtime) }} • {{ featuredMovieGenres }}
        </p>
        <p class="banner-description">{{ featuredMovie.overview }}</p>


      </div>

    </div>

    <div class="movies-section">
      <h2>Filmes populares</h2>
      <div v-if="isLoading" class="loading-message">
        Carregando filmes...
      </div>
      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-else class="movies-carousel">
        <button class="nav-button prev-button" @click="scrollPopularMovies('prev')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M11.72 4.22a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L18.19 12l-6.47-6.47a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="movies-list" ref="moviesListRef">
          <div v-for="movie in movies" :key="movie.id" class="movie-card">
            <img :src="getImageUrl(movie.poster_path, 'poster')" :alt="movie.title" class="movie-poster" />
            <div class="movie-info">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <p class="movie-genres">
                {{ movie.release_date ? movie.release_date.substring(0, 4) : 'Ano Desconhecido' }}
              </p>
            </div>
          </div>
        </div>

        <button class="nav-button next-button" @click="scrollPopularMovies('next')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M11.72 4.22a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L18.19 12l-6.47-6.47a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="movies-section">
      <h2>Melhores Avaliações</h2>
      <div v-if="isLoading" class="loading-message">
        Carregando filmes...
      </div>
      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-else class="movies-carousel">
        <button class="nav-button prev-button" @click="scrollTopRatedMovies('prev')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M11.72 4.22a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L18.19 12l-6.47-6.47a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="movies-list" ref="topRatedListRef">
          <div v-for="movie in topRated" :key="movie.id" class="movie-card">
            <img :src="getImageUrl(movie.poster_path, 'poster')" :alt="movie.title" class="movie-poster" />
            <div class="movie-info">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <p class="movie-genres">
                {{ movie.release_date ? movie.release_date.substring(0, 4) : 'Ano Desconhecido' }}
              </p>
            </div>
          </div>
        </div>

        <button class="nav-button next-button" @click="scrollTopRatedMovies('next')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M11.72 4.22a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L18.19 12l-6.47-6.47a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  background-color: #000;
  color: #fff;
  font-family: Arial, sans-serif;
}

.loading-full-screen,
.error-full-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 2em;
  color: #ccc;
  background-color: #1a1a1a;
}

.main-banner {
  width: 100%;
  height: 600px;
  background-size: cover;
  background-position: center center;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 50px;
  box-sizing: border-box;
}

.main-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%);
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.banner-year {
  font-size: 1.2em;
  color: #ccc;
  margin-bottom: 5px;
}

.banner-title {
  font-size: 4em;
  font-weight: bold;
  margin-bottom: 15px;
  line-height: 1.1;
}

.banner-meta {
  font-size: 1.1em;
  color: #e0e0e0;
  margin-bottom: 15px;
}

.banner-description {
  font-size: 1.1em;
  line-height: 1.5;
  margin-bottom: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-primary {
  background-color: #e50914;
  color: #fff;
}

.btn-primary:hover {
  background-color: #f40612;
}

.btn-secondary {
  background-color: rgba(109, 109, 109, 0.7);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background-color: rgba(109, 109, 109, 0.9);
}

.btn-primary svg,
.btn-secondary svg {
  width: 20px;
  height: 20px;
}

.banner-indicators {
  position: absolute;
  bottom: 20px;
  right: 50px;
  z-index: 2;
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

.indicator.active {
  background-color: #e50914;
}

.movies-section {
  padding: 20px;
  background-color: #1a1a1a;
  margin-top: 20px;
}

.movies-section h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
  color: #f0f0f0;
}

.movies-carousel {
  display: flex;
  align-items: center;
  position: relative;

  padding-left: 20px;
  padding-right: 20px;
}

.movies-list {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  gap: 20px;
  padding-bottom: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-grow: 1;
}

.movies-list::-webkit-scrollbar {
  display: none;
}

.movie-card {
  flex: 0 0 auto;
  width: 200px;
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
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
}

.nav-button {
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  position: absolute;
  color: #fff;
  transition: background-color 0.3s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

.prev-button {
  left: -20px;
  transform: rotate(180deg);
}

.next-button {
  right: -20px;
  transform: none;
}


.movies-carousel:hover .nav-button {
  opacity: 1;
}


.movies-list::-webkit-scrollbar {
  display: none;
}

.movies-list {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-x: auto;
}



</style>
