import nodeResolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import typescript from 'typescript';
import typescriptPlugin from 'rollup-plugin-typescript2';
// import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';

const config = [
   {
    external: ['react', 'react-dom'],
    input: 'src/index.ts',
    output: {
      file: 'dist/hooked-form.modern.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        mainFields: ['module', 'jsnext', 'main'],
        only: ['tslib', 'use-context-selector']
      }),
      typescriptPlugin({ typescript, tsconfig: './tsconfig.json' }),
      filesize(),
    ],
   },
   {
    input: 'src/index.ts',
    output: {
      file: 'dist/prod/hooked-form.modern.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      nodeResolve({
        mainFields: ['module', 'jsnext', 'main'],
        only: ['tslib', 'use-context-selector']
      }),
      typescriptPlugin({ typescript, tsconfig: './tsconfig.json', objectHashIgnoreUnknownHack: true }),
      // compiler({ compilation_level: 'ADVANCED_OPTIMIZATIONS' }),
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10,
          global_defs: { 'process.env.NODE_ENV': 'production' }
        },
        warnings: true,
        ecma: 6,
        toplevel: true,
        mangle: { properties: '^_' },
      }),
      filesize(),
    ],
   },
];

export default config;
