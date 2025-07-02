import axios from 'axios';

/**
 * @returns {Promise<Array<Object>>}
 */
export const fetchGenres = async () => {
  try {
    const response = await axios.get('http://localhost:8089/api/v1/genres');
    return response.data.genres;
  } catch (err) {
    console.error('Erro ao buscar gêneros:', err);
    throw new Error('Não foi possível carregar os gêneros. Tente novamente mais tarde.');
  }
};
