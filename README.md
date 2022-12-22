# jspsych-gabor-stimulus-plugin

**Note: This is a development branch. While some things might work, others might as well not.**

This is an attempt to move all the heavy lifting (gabor and noise generation) to the beginning of an experiment, in order to improve performance at runtime.

## How to use

### Install

To use this development version of the plugin, you have to build it yourself using `yarn build`. Two files get created in this process under `dist/`: A JavaScript bundle which contains all necessary code and a TypeScript declaration file which contains types. You do not necessarily need the declaration file.

### Example

The usage of this version differs heavily from older versions of the plugin.

```javascript
// Import plugin code
import GaborStimulusPlugin, {
  pregenerateGabor,
  generateFixationCrossTrial,
} from './jspsych-gabor-stimulus-plugin';

// ...

// Generate a fixation cross trial (size of stimulus, size of cross, thickness of cross, color, duration)
const fixCrossTrial = generateFixationCrossTrial(300, 20, 4, 'white', 1000);

// Pregenerate a gabor patch
pregenerateGabor('default', {
  size: 300,
});

// Push the plugin to the timeline
timeline.push({
  type: GaborStimulusPlugin,
  choices: [' '],
  options: {
    stimulus: {
      rotation: 45,
      visibility: 0.3,
    },
    fixation_cross: {
      color: 'white',
      size: 20,
      weight: 4,
    },
  },
});
```

A bit more detailed API docs are provided through the TypeScript types.

### Data saved by the plugin

The following data are collected:

- `response`: The key pressed by the participant
- `rt`: The reaction time

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
[2]: https://www.jspsych.org/7.2/plugins/html-keyboard-response/
[3]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
[4]: https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
