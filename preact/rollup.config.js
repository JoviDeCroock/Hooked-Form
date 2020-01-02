import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    external: ['preact', 'preact/hooks'],
    input: './src/index.ts',
    treeshake: {
      propertyReadSideEffects: false
    },
    plugins: [
      nodeResolve({
        mainFields: ['module', 'jsnext', 'main'],
        browser: true
      }),
      commonjs({
        ignoreGlobal: true,
        include: /\/node_modules\//,
      }),
      typescript({
        typescript: require('typescript'),
        cacheRoot: './node_modules/.cache/.rts2_cache',
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          compilerOptions: {
            sourceMap: true
          },
        },
        tsconfigOverride: {
         exclude: [
           'src/**/*.test.ts',
           'src/**/*.test.tsx',
           'src/**/test-utils/*'
         ],
         compilerOptions: {
            declaration: true,
            declarationDir: `./dist/types/`,
            target: 'es6',
          },
        },
      }),
      buble({
        transforms: {
          unicodeRegExp: false,
          dangerousForOf: true,
          dangerousTaggedTemplateString: true
        },
        exclude: 'node_modules/**'
      }),
      terser({
        sourcemap: true,
        warnings: true,
        ecma: 5,
        keep_fnames: true,
        ie8: false,
        compress: {
          pure_getters: true,
          toplevel: true,
          booleans_as_integers: false,
          keep_fnames: true,
          keep_fargs: true,
          if_return: false,
          ie8: false,
          sequences: false,
          loops: false,
          conditionals: false,
          join_vars: false
        },
        mangle: false,
        output: {
          beautify: true,
          braces: true,
          indent_level: 2
        }
      }),
    ],
    output: [
      {
        sourcemap: true,
        legacy: true,
        freeze: false,
        esModule: false,
        dir: './dist/cjs',
        format: 'cjs',
      },
      {
        sourcemap: true,
        legacy: true,
        freeze: false,
        esModule: false,
        dir: './dist/es',
        format: 'esm',
      },
    ],
  },
];
