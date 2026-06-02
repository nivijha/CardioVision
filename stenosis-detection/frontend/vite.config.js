import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Allow overriding backend target during local development via BACKEND_URL env var
const backendTarget = process.env.BACKEND_URL || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
