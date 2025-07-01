import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    authError: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => state.token !== null,
    authToken: (state) => state.token,
  },
  actions: {
    async login(email, password) {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await axios.post('http://localhost:8089/api/v1/auth/login', { email, password });

        const { user, access_token } = response.data.data;

        this.user = user;
        this.token = access_token;
        // this.isAuthenticated = true;
        localStorage.setItem('auth_token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      } catch (error) {
        this.authError = error.response?.data?.message || 'Erro ao fazer login.';
        console.error('Erro de login:', error);
        throw new Error(this.authError);
      } finally {
        this.isLoading = false;
      }
    },
    async register(name, email, password) {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await axios.post('http://localhost:8089/api/v1/auth/register', { name, email, password });
        return response.data;
      } catch (error) {
        this.authError = error.response?.data?.message || 'Erro ao cadastrar.';
        console.error('Erro de cadastro:', error);
        throw new Error(this.authError);
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      // this.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  },
});
