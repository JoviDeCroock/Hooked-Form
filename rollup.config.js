import nodeResolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import typescript from 'typescript';
import typescriptPlugin from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const config = [
   {
    input: 'src/index.ts',
    output: {
      file: 'dist/hooked-form.modern.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        module: true,
        only: ['tslib']
      }),
      typescriptPlugin({ typescript, tsconfig: './tsconfig.json' }),
      filesize(),
    ],
   }, {
    input: 'src/index.ts',
    output: {
      file: 'dist/prod/hooked-form.modern.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        module: true,
        only: ['tslib']
      }),
      typescriptPlugin({ typescript, tsconfig: './tsconfig.json' }),
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
   }
];

export default config;
