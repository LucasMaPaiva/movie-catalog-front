import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Necessário para que o servidor seja acessível de fora do container Docker
    port: 5173, // Atualizado para a porta 5173, conforme a saída do Vite
    proxy: {
      '/api': { // Qualquer requisição que começar com /api será redirecionada
        target: 'http://nginx', // Aponta para o serviço Nginx no Docker Compose
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove o prefixo /api antes de enviar para o backend
      }
    }
  }
})
