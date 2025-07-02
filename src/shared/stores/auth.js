import { defineStore } from 'pinia';
import axios from 'axios';
import { HttpClientService } from '@/shared/services/http_client/HttpClientService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user_data') || 'null'),
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    authError: null,
    isLoading: false,
    httpClient: new HttpClientService()
  }),
  getters: {
    isAuthenticated: (state) => state.token !== null,
    authToken: (state) => state.token,
    userId: (state) => state.user ? state.user.id : null,
  },
  actions: {
    async login(email, password) {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await this.httpClient.post('/auth/login', { email, password });

        const { user, access_token } = response.data.data;

        this.user = user;
        this.token = access_token;

        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));

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
        const response = await this.httpClient.post('/auth/register', { name, email, password });
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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      delete axios.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  },
});
