# typescript-library-template

This project was generated using `typescript-library-template`. It leverages modern JavaScript/TypeScript tooling to provide a good starting point for developing a robust library/package.

## Features

- ⚙️ _TypeScript_
- 📦 Bundling with _rollup.js_
- 🧑‍🔬 Testing with Jest and _ts-jest_
- 🕺 Consistent code style with _Prettier_

## How to use

After having cloned the repo and installed the dependencies using `yarn install`, start to build your library from `src/lib.ts` - this is the entry point.

The convention for writing tests is to create `.test.ts` file for each module (i.e. for each `.ts` file) which tests the functionality of that module.

### Available commands

**`yarn run test`**

Run the whole test suite (all `.test.ts` tests).

**`yarn run build`**

Create a bundle (a single file containing all code) of the library under `dist/` with a corresponding [_declaration file_][1].

**`yarn run fmt`**

Format your code using the guidelines defined in `.prettierrc.json`.

### Use the library in your projects

This template works with ES modules (the native JavaScript way to split code into modules in different files). Therefore there are multiple ways to include the final bundle a project. Two common, modern examples discussed here.

**1. Copy the resluting bundle to you project's source directory**

If you don't want to publish your library to the public [npm registry][2], and neither want to pay for a private plan, this is a good way to include your library in a project. Just copy the file to you source code directory and `import` your library's exported features.

Note that you will need a module bundler, like [_webpack_][3], to resolve the import statements.

The drawback of this solution is that if you make an update to your library, you have to copy the bundle manually to your project to use the updates.

**2. Publish your library to the npm registry**

You can either publish it publicly for free, or pay for a private plan. This way your library will behave like any of the big ones out there.

To publish a library, you should make some adjustments to your `package.json`. In specific, add a `publishConfig`, a `repository` and a `keywords` key:

```json
"publishConfig": {
  "access": "public"
},
"repository": {
  "type": "git",
  "url": "https://github.com/you/your-library"
},
"keywords": [
  "library",
  "typescript"
]
```

Also make sure, you have the right name and version set (if you want to publish it under an organization, prefix the name with `@your-org/`).

Then, bundle the library with `yarn run build` and publish it using `yarn npm publish`. Please mind _semantic versioning_.

[1]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#dts-files
[2]: https://www.npmjs.com/
[3]: https://webpack.js.org/
