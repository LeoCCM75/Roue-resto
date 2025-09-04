import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', ''); // ok si tu veux lire d'autres vars publiques (préfixées VITE_)
  return {
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') }
    }
  };
});

