import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/lib.ts',
    output: [
      {
        name: 'jspsych-library-template',
        file: 'dist/jspsych-library-template.js',
        format: 'es',
      },
    ],
    plugins: [ts()],
  },
];
