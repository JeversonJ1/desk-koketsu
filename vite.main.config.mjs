import { defineConfig } from 'vite';

// Adicione esta configuração para ignorar o banco de dados na hora de compilar
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['better-sqlite3'], 
    },
  },
  resolve: {
    // Isso ajuda a carregar módulos nativos corretamente
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});