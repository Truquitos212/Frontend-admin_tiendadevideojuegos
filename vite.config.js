import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Puerto distinto para el panel Admin
    open: true,
  },
  define: {
    global: 'window',
  },
});