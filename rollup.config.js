export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/epstein.js', format: 'cjs' },
    { file: 'dist/epstein.es.js', format: 'es' },
    { file: 'dist/epstein.umd.js', format: 'umd', moduleName: 'epstein' },
  ],
};
