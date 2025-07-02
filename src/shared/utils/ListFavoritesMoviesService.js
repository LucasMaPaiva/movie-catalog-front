import { HttpClientService } from '@/shared/services/http_client/HttpClientService.js'

/**
 * @param {string} userId
 * @param {string | null} genreIds
 * @returns {Promise<Array>}
 */
export const fetchFavoriteMovies = async (userId, genreIds = null) => {
  const httpClient = new HttpClientService();

  if (!userId) {
    throw new Error('ID do usuário é necessário para buscar filmes favoritos.');
  }

  let url = `/user/${userId}/list-favorites`;

  if (genreIds) {
    url += `?genre_ids=${genreIds}`;
  }

  try {
    const response = await httpClient.get(url);
    return response.data.data;
  } catch (err) {
    console.error('Erro na chamada da API fetchFavoriteMovies:', err);
    throw new Error('Não foi possível carregar os filmes favoritos. Por favor, tente novamente.');
  }
};
