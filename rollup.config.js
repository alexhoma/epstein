import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/epstein.js',
      format: 'cjs',
    },
    plugins: [
      resolve({
        extensions: ['.js'],
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/epstein.es.js',
      format: 'es',
    },
    plugins: [
      resolve({
        extensions: ['.js'],
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/epstein.umd.js',
      format: 'umd',
      name: 'epstein',
    },
    plugins: [
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
      resolve({
        extensions: ['.js'],
      }),
    ],
  },
];
