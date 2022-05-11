# jspsych-gabor-stimulus-plugin

This project aims to provide a jsPsych plugin for generating gabor patch stimuli. Once it reaches reasonable stability, test coverage and usability, it will be proposed to the jsPsych team for integration into the main codebase.

## How to use

### TypeScript example

```typescript
// Import plugin and config type
import GaborStimulusPlugin, {
  GaborStimulusPluginConfig,
} from '@kogpsy/jspsych-gabor-stimulus-plugin';

// ...

// Define configuration object
const gaborConf: GaborStimulusPluginConfig = {
  stimulus: {
    size: 200,
    rotation: 45,
  },
  fixationCross: {
    size: 20,
    weight: 4,
    color: 'white',
  },
};

// Push the plugin to the timeline
timeline.push({
  type: GaborStimulusPlugin,
  config: gaborConf,
});
```

This will produce the following result:

![Stimulus Example](static/stimulus_example.png)

If you want to use the plugin with plain JavaScript, simply don't import the config type and omit the type assignment by changing the first line of the config definition from:

```typescript
const gaborConf: GaborStimulusPluginConfig = {
```

to:

```javascript
const gaborConf = {
```

### Configuration reference

The configuration object allows broad control over how the gabor patch generated. You can control the stimulus itself using the `stimulus` key, the aperture using the `aperture` key, the background using the `background` key, a possible fixation cross using the `fixationCross` key and the possible keyboard responses using the `choices` key:

```typescript
const conf: GaborStimulusPluginConfig = {
  stimulus: {
    // ...
  },
  aperture: {
    // ...
  }
  background: {
    // ...
  }
  fixationCross: {
    // ...
  },
  choices: [/* ... */]
};
```

Each of these keys takes an object which is explored in the following.

**`stimulus`**

You can control the stimulus using the following fields:

TODO: md table presenting all possible keys and defaults

## Development

After having cloned the repo and installed the dependencies using `yarn install`, start to build your library from `src/lib.ts` - this is the entry point.

The convention for writing tests is to create `.test.ts` file for each module (i.e. for each `.ts` file) which tests the functionality of that module.

### Available commands

**`yarn run test`**

Run the whole test suite (all `.test.ts` tests).

**`yarn run build`**

Create a bundle (a single file containing all code) of the library under `dist/` with a corresponding [_declaration file_][1].

**`yarn run fmt`**

Format your code using the guidelines defined in `.prettierrc.json`.

[1]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#dts-files
