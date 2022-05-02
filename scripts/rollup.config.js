import path from 'path';
import vue from '@vitejs/plugin-vue';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import typescript from 'rollup-plugin-ts';
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
const basePath = path.resolve(__dirname, '../');
console.log(basePath);

export default {
  input: `${basePath}/src/main.ts`,
  output: [
    {
      name: 'vrunning',
      file: `${basePath}/dist/index.mjs`,
      format: 'es',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
    {
      name: 'vrunning',
      file: `${basePath}/dist/index.cjs`,
      format: 'umd',
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
    },
  ],
  plugins: [
    // typescript(),
    ts({
      tsconfigOverride: {
        compilerOptions: {
          target: 'es5',
        },
      }
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
