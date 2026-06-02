import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      root: resolve(__dirname, 'test'),
      server: {
        port: 3000,
      },
    };
  } else {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'qgfx',
          fileName: (format) => {
            if (format === 'es') return 'index.js';
            if (format === 'cjs') return 'index.cjs';
            return `index.${format}.js`;
          },
          formats: ['es', 'cjs'],
        },
        sourcemap: true,
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
          external: [],
        },
      },
      plugins: [
        dts({
          entryRoot: resolve(__dirname, 'src'),
          tsconfigPath: resolve(__dirname, 'tsconfig.json'),
          bundleTypes: true,
        }),
      ],
    };
  }
});
