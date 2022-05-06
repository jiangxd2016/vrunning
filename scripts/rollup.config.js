import path from 'path';
import vue from '@vitejs/plugin-vue';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-ts';

import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
const basePath = path.resolve(__dirname, '../');
export default {
  input: `${basePath}/src/main.ts`,
  output: [
    {
      name: 'vue-running',
      file: `${basePath}/dist/vue-running.mjs`,
      format: 'es',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
    {
      name: 'vue-running',
      file: `${basePath}/dist/vue-running.cjs`,
      format: 'umd',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
  ],
  plugins: [
    typescript(),
    vue(),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    terser(),
    esbuild({
      sourceMap: true,
    }),
    postcss({
      extract: true,
    }),
  ],
  external: ['vue'],
};
