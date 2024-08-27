import path from 'path';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  defineConfig as defineViteConfig,
  mergeConfig,
  splitVendorChunkPlugin,
} from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';

const viteConfig = defineViteConfig({
  plugins: [
    react(),
    dts(),
    splitVendorChunkPlugin(),
    checker({
      typescript: true,
    }),
    visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['node'],
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/tests/setup.tsx',
    coverage: {
      enabled: false,
      provider: 'istanbul', // 'v8' | 'istanbul'
      include: [
        'src/components/**/*',
        'src/pages/**/*',
        'src/stores/**/*',
        'src/utils/functions/**/*',
        'src/utils/hooks/**/*',
      ],
      exclude: [],
      reporter: ['text', 'json', 'html'],
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
