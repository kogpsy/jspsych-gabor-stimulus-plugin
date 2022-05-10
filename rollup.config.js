import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/lib.ts',
    output: [
      {
        name: 'jspsych-gabor-stimulus-plugin',
        file: 'dist/jspsych-gabor-stimulus-plugin.js',
        format: 'es',
      },
    ],
    external: ['jspsych'],
    plugins: [ts()],
  },
];
