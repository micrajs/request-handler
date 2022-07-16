import {defineConfig} from '@micra/vite-config/library';
import {resolve} from 'path';

const cwd = (...paths: string[]) => resolve(process.cwd(), ...paths);

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@micra/core', '@micra/error'],
      input: {
        index: cwd('index.ts'),
        utilities: cwd('utilities.ts'),
      },
    },
  },
});
