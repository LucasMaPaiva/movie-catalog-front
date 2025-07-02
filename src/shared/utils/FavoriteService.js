// src/shared/utils/FavoriteService.js
import { HttpClientService } from '@/shared/services/http_client/HttpClientService.js'

/**
 * @param {string} userId
 * @param {object} movieData
 * @returns {Promise<object>}
 */
export const addMovieToFavorites = async (userId, movieData) => {
  const httpClient = new HttpClientService();

  try {
    const response = await httpClient.post(`/user/${userId}/favorite-movie`, movieData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar filme aos favoritos:', error);
    throw new Error('Não foi possível adicionar o filme aos favoritos. Por favor, tente novamente.');
  }
};

/**
 * @param {string} userId
 * @param {number} movieId
 * @returns {Promise<object>}
 */
export const removeMovieFromFavorites = async (userId, movieId) => {
  const httpClient = new HttpClientService();

  try {
    const response = await httpClient.post(`/user/${userId}/remove-favorite`, { movie_id: movieId });
    return response.data;
  } catch (error) {
    console.error('Erro ao remover filme dos favoritos:', error);
    throw new Error('Não foi possível remover o filme dos favoritos. Por favor, tente novamente.');
  }
};
