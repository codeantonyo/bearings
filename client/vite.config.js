import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The client talks to the API at /api and loads product images from /uploads.
// Both are proxied to the Express server in dev so there are no CORS/URL issues.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
});
