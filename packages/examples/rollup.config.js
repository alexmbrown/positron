import typescript from 'rollup-plugin-typescript';

const examples = [
  '01-hello-world',
  '02-node'
]

export default examples.map(example => ({
  input: `./src/${example}/main.ts`,
  output: {
    format: 'umd',
    globals: {
      '@positron/core': 'Positron'
    },
    file: `./dist/${example}/main.js`
  },
  plugins: [
    typescript()
  ]
}));
