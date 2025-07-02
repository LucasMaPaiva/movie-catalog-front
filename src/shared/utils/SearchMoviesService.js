import { HttpClientService } from '@/shared/services/http_client/HttpClientService.js'

/**
 * @param {string} query
 * @returns {Promise<Array>}
 * @throws {Error}
 */
export const fetchMoviesSearch = async (query) => {
  const httpClient = new HttpClientService();

  try {
    const response = await httpClient.get(`/movies/search?query=${query}`);
    return response.data.results || [];
  } catch (err) {
    console.error('Erro na chamada da API fetchMoviesSearch:', err);
    throw new Error('Não foi possível carregar os filmes da busca. Tente novamente mais tarde.');
  }
};
