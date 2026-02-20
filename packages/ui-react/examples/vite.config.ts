import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: {
      '@editora/ui-react': resolve(rootDir, '../src/index.tsx')
    }
  },
  server: {
    port: 4173
  }
});
