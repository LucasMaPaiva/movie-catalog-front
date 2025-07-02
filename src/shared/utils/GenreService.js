import { HttpClientService } from '@/shared/services/http_client/HttpClientService.js'

/**
 * @returns {Promise<Array<Object>>}
 */
export const fetchGenres = async () => {
  const httpClient = new HttpClientService();

  try {
    const response = await httpClient.get('/genres');
    return response.data.genres;
  } catch (err) {
    console.error('Erro ao buscar gêneros:', err);
    throw new Error('Não foi possível carregar os gêneros. Tente novamente mais tarde.');
  }
};
