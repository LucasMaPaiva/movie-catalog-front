import { HttpClientService } from '@/shared/services/http_client/HttpClientService.js'

/**
 * @returns {Promise<Array>}
 */
export const fetchTopRated = async () => {
  const httpClient = new HttpClientService();

  try {
    const response = await httpClient.get('/movies/top_rated');
    return response.data;
  } catch (err) {
    console.error('Erro na chamada da API fetchMovies:', err);
    throw new Error('Não foi possível carregar os filmes da API.');
  }
};
