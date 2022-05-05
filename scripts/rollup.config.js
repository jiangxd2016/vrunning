import path from 'path';
import vue from '@vitejs/plugin-vue';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-ts';
import typescript from 'rollup-plugin-typescript2';

import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
const basePath = path.resolve(__dirname, '../');
export default {
  input: `${basePath}/src/main.ts`,
  output: [
    {
      name: 'vue-running',
      file: `${basePath}/dist/index.mjs`,
      format: 'es',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
    {
      name: 'vue-running',
      file: `${basePath}/dist/index.cjs`,
      format: 'umd',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './src/tsconfig.json',
    }),
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
