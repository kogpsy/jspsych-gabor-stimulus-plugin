import ts from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

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
  {
    input: 'src/lib.ts',
    output: {
      file: 'dist/jspsych-gabor-stimulus-plugin.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
