import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: {
      '@editora/icons': resolve(rootDir, '../../icons/src/index.ts'),
      '@editora/react-icons': resolve(rootDir, '../../react-icons/src/index.ts'),
      '@editora/ui-core': resolve(rootDir, '../../ui-core/src/index.ts'),
      '@editora/ui-react': resolve(rootDir, '../src/index.tsx')
    }
  },
  server: {
    port: 4173
  }
});
