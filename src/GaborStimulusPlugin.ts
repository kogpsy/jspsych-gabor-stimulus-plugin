/**
 * GaborStimulusPlugin
 *
 * A jsPsych plugin to generate gabor patch stimuli.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

// Import jsPsych related code
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';
import AnimationLoop from './AnimationLoop';
import { InternalConfig, parseConfig } from './ConfigParser';
import { generateGabor } from './GaborGen';

// Define plugin info
const info: any = <const>{
  name: 'gabor-stimulus-plugin',
  parameters: {
    config: {
      type: ParameterType.OBJECT,
      default: undefined,
    },
  },
};

// Derive type from plugin info
type Info = typeof info;

/**
 * **gabor-stimulus-plugin**
 *
 * A jsPsych plugin to generate circular sine stimuli (also known as bullseye
 * stimuli).
 *
 * @author Robin Bürkli
 * @see {@link https://github.com/kogpsy/jspsych-circular-sine-stimulus-plugin Documentation}
 */
class GaborStimulusPlugin implements JsPsychPlugin<Info> {
  // Add static info
  static info = info;

  // Constructor
  constructor(private jsPsych: JsPsych) {
    // Bind jsPsych instance
    this.jsPsych = jsPsych;
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    // First clear the display element
    display_element.innerHTML = '';

    // Parse the provided config into a consistent format
    const config: InternalConfig = parseConfig(trial.config);

    // Create the container for everything
    const container = setUpContainer(config.stimulus.size);

    // Generate the stimulus as SVG
    const svg = generateGabor(
      config.stimulus.size,
      config.stimulus.density,
      config.stimulus.density,
      config.stimulus.opacity,
      config.stimulus.rotation,
      config.stimulus.blendMode,
      config.aperture.radius,
      config.aperture.blur
    );

    // Add SVG to container
    container.appendChild(svg);

    // Create the background based on the received properties
    const { backgroundContainer, animationLoop } = setUpBackground(config);

    // Add canvas to container
    container.appendChild(backgroundContainer);

    // Create a temporary parent div, since the DOM only seems to get updated
    // when setting the new elements using innerHTML(), but not append.
    const tmpParent = document.createElement('div');
    tmpParent.appendChild(container);
    // Then update the DOM
    display_element.innerHTML = tmpParent.innerHTML;

    // Handler for key strokes
    const handleKeyResponse = (info: any) => {
      // If the background is animated, end animation
      if (config.background.type === 'animation') {
        animationLoop?.stopLoop();
      }

      // Clear display
      display_element.innerHTML = '';

      // Create data object
      const data = {
        rt: info.rt,
        response: info.key,
      };

      // End trial
      this.jsPsych.finishTrial(data);
    };

    // Setup a listener to key strokes
    this.jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: handleKeyResponse,
      valid_responses: config.choices,
      persist: false,
    });
  }
}

const setUpBackground = (
  config: InternalConfig
): {
  backgroundContainer: HTMLDivElement;
  animationCanvas?: HTMLCanvasElement;
  animationLoop?: AnimationLoop;
} => {
  const backgroundContainer = document.createElement('div');
  backgroundContainer.style['position'] = 'absolute';
  backgroundContainer.style['left'] = '0';
  backgroundContainer.style['top'] = '0';
  backgroundContainer.style['width'] = '100%';
  backgroundContainer.style['height'] = '100%';

  if (config.background.type === 'animation') {
    const { canvas, animationLoop } = setUpAnimationCanvas(
      config.background.frames,
      config.background.fps
    );

    backgroundContainer.appendChild(canvas);

    return {
      backgroundContainer,
      animationCanvas: canvas,
      animationLoop,
    };
  } else if (config.background.type === 'css-color') {
    backgroundContainer.style.backgroundColor = config.background.color;

    return {
      backgroundContainer,
    };
  } else if (config.background.type === 'image') {
    backgroundContainer.style.backgroundImage = `url("${config.background.source}")`;

    return { backgroundContainer };
  }
};

const setUpAnimationCanvas = (
  frames: string[],
  fps: number
): { canvas: HTMLCanvasElement; animationLoop: AnimationLoop } => {
  // Create the canvas for the background rendering (if animation)
  const canvas = document.createElement('canvas');
  canvas.id = 'circular-sine-stimulus-background';

  let frameIndex: number;
  let newFrameIndex: number;

  const animationFunction = () => {
    // For some reason the canvas element created above is undefined at this
    // point of the code lifecycle. I don't understand why, but retrieving the
    // instance in every frame is a functional workaround.
    const canvas = <HTMLCanvasElement>(
      document.getElementById('circular-sine-stimulus-background')
    );

    do {
      newFrameIndex = Math.floor(Math.random() * frames.length);
    } while (newFrameIndex === frameIndex);
    frameIndex = newFrameIndex;

    // @ts-ignore
    const image = new Image();
    image.src = frames[frameIndex];

    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    canvas.getContext('2d').drawImage(image, 0, 0);
  };

  const animationLoop = new AnimationLoop(fps, animationFunction);
  animationLoop.startLoop();

  return {
    canvas,
    animationLoop,
  };
};

// Create a container for the svg
const setUpContainer = (size: number): HTMLElement => {
  const container = document.createElement('div');
  container.id = 'circular-sine-stimulus-container';
  container.style['position'] = 'relative';
  container.style['width'] = `${size}px`;
  container.style['height'] = `${size}px`;

  return container;
};

export default GaborStimulusPlugin;
