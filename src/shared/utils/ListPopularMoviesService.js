import { HttpClientService } from '@/shared/services/http_client/HttpClientService'

/**
 * @returns {Promise<Array>}
 */
export const fetchMovies = async () => {
  const httpClient = new HttpClientService();

  try {
    const response = await httpClient.get('/movies/popular');
    return response.data;
  } catch (err) {
    console.error('Erro na chamada da API fetchMovies:', err);
    throw new Error('Não foi possível carregar os filmes da API.');
  }
};
