// src/shared/utils/FavoriteService.js
import axios from 'axios';

/**
 * @param {string} userId
 * @param {object} movieData
 * @returns {Promise<object>}
 */
export const addMovieToFavorites = async (userId, movieData) => {
  try {
    const response = await axios.post(`http://localhost:8089/api/v1/user/${userId}/favorite-movie`, movieData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar filme aos favoritos:', error);
    throw new Error('Não foi possível adicionar o filme aos favoritos. Por favor, tente novamente.');
  }
};

/**
 * @param {string} userId
 * @param {number} movieId - O ID do filme a ser removido.
 * @returns {Promise<object>}
 */
export const removeMovieFromFavorites = async (userId, movieId) => {
  try {
    const response = await axios.post(`http://localhost:8089/api/v1/user/${userId}/remove-favorite`, { movie_id: movieId });
    return response.data;
  } catch (error) {
    console.error('Erro ao remover filme dos favoritos:', error);
    throw new Error('Não foi possível remover o filme dos favoritos. Por favor, tente novamente.');
  }
};
