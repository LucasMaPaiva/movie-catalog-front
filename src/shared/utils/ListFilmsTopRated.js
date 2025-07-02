import axios from 'axios';

/**
 * @returns {Promise<Array>}
 */
export const fetchTopRated = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/v1/movies/top_rated');
    return response.data;
  } catch (err) {
    console.error('Erro na chamada da API fetchMovies:', err);
    throw new Error('Não foi possível carregar os filmes da API.');
  }
};
