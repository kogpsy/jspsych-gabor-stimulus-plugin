# Development

After having cloned the repo and installed the dependencies using `yarn install`, start to build your library from `src/lib.ts` - this is the entry point.

The convention for writing tests is to create `.test.ts` file for each module (i.e. for each `.ts` file) which tests the functionality of that module.

## Available commands

**`yarn run test`**

Run the whole test suite (all `.test.ts` tests).

**`yarn run build`**

Create a bundle (a single file containing all code) of the library under `dist/` with a corresponding [_declaration file_][1].

**`yarn run fmt`**

Format your code using the guidelines defined in `.prettierrc.json`.

[1]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#dts-files
