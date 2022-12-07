import ts from '@rollup/plugin-typescript';

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
