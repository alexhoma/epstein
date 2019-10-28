import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/epstein.js', format: 'cjs' },
    { file: 'dist/epstein.es.js', format: 'es' },
    { file: 'dist/epstein.umd.js', format: 'umd', name: 'epstein' },
  ],
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
  ],
};
