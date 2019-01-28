import typescript from 'rollup-plugin-typescript';
import examplesData from './src/examples.json';

export default examplesData.examples.map(example => ({
  input: `./src/${example.path}/main.ts`,
  output: {
    format: 'umd',
    globals: {
      '@positron/core': 'Positron'
    },
    file: `./dist/${example.path}/main.js`
  },
  plugins: [
    typescript()
  ]
}));
