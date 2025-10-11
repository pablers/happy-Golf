import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiProxyTarget = env.VITE_API_URL ?? 'http://localhost:3001'; // Destino del backend para reenviar peticiones durante el desarrollo.
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        proxy: {
          '/api': {
            target: apiProxyTarget, // Redirige las peticiones de /api al backend configurado en la variable de entorno.
            changeOrigin: true, // Ajusta la cabecera Origin para evitar problemas de CORS durante el desarrollo.
            // Conservamos el prefijo /api porque el backend NestJS aplica el mismo prefijo global en sus rutas.
          },
        },
      }
    };
});
