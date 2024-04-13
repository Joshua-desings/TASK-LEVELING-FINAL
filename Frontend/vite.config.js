import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Task Leveling',
        short_name: 'TaskLeveling',
        description: 'Task-Leveling (PWA) combina la gestión de tareas con elementos RPG. Organiza tus tareas diarias como si fueran misiones épicas, asignándoles niveles de importancia y estableciendo prioridades. ¡Domina tus responsabilidades y conviértete en el héroe de tu propia aventura diaria con Task-Leveling!',
        start_url: '/',
        display: 'standalone',
        background_color: '#F5F5F5',
        theme_color: '#2979FF',
        icons: [
          {
            src: '/images/Logo_prototype_192px.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/Logo_prototype_512px.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
