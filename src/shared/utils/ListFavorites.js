import axios from 'axios';

/**
 * @param {string} userId
 * @param {string | null} genreIds
 * @returns {Promise<Array>}
 */
export const fetchFavoriteMovies = async (userId, genreIds = null) => {
  if (!userId) {
    throw new Error('ID do usuário é necessário para buscar filmes favoritos.');
  }

  let url = `http://localhost:8089/api/v1/user/${userId}/list-favorites`;

  if (genreIds) {
    url += `?genre_ids=${genreIds}`;
  }

  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (err) {
    console.error('Erro na chamada da API fetchFavoriteMovies:', err);
    throw new Error('Não foi possível carregar os filmes favoritos. Por favor, tente novamente.');
  }
};
