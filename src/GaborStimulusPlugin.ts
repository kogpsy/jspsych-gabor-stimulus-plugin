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

/**
 * Sets up the background of the stimulus based on the plugin configuration
 *
 * @param config Configuration of the plugin
 * @returns An object containing the background container as an HTMLDivElement
 * and if an animation was requested an AnimationLoop object (which can be used
 * to start and stop the animation)
 */
const setUpBackground = (
  config: InternalConfig
): {
  backgroundContainer: HTMLDivElement;
  animationLoop?: AnimationLoop;
} => {
  // Create background container div and add css
  const backgroundContainer = document.createElement('div');
  backgroundContainer.style.position = 'absolute';
  backgroundContainer.style.left = '0';
  backgroundContainer.style.top = '0';
  backgroundContainer.style.width = '100%';
  backgroundContainer.style.height = '100%';

  // If the requested background is an animation
  if (config.background.type === 'animation') {
    // Set up the animation loop and canvas
    const { canvas, animationLoop } = setUpAnimationCanvas(
      config.background.frames,
      config.background.fps
    );
    // And add the canvas to the background container
    backgroundContainer.appendChild(canvas);

    // Return container and loop object
    return {
      backgroundContainer,
      animationLoop,
    };
  }

  // If the requested background is a css color, set it accordingly
  else if (config.background.type === 'css-color') {
    backgroundContainer.style.backgroundColor = config.background.color;
    return {
      backgroundContainer,
    };
  }

  // If the requested background is a static image, set it accordingly
  else if (config.background.type === 'image') {
    backgroundContainer.style.backgroundImage = `url("${config.background.source}")`;
    return { backgroundContainer };
  }
};

/**
 * Creates an HTMLCanvasElement and an AnimationLoop instance based on params
 *
 * @param frames An array of data urls / paths which will be used as the frames
 * of the animation
 * @param fps Speed of the animation (frames per second)
 * @returns An object containing an HTMLCanvasElement and an AnimationLoop
 * instance to start and stop the animation
 */
const setUpAnimationCanvas = (
  frames: string[],
  fps: number
): { canvas: HTMLCanvasElement; animationLoop: AnimationLoop } => {
  // Create the canvas to render the frames on
  const canvas = document.createElement('canvas');
  canvas.id = 'circular-sine-stimulus-background';

  // Declare variables used in the animation function
  let frameIndex: number;
  let newFrameIndex: number;

  // Define the animation function (will be called by the AnimationLoop at a
  // certain FPS)
  const animationFunction = () => {
    // For some reason the canvas element created above is undefined at this
    // point of the code lifecycle. I don't understand why, but retrieving the
    // instance in every frame is a functional workaround.
    const canvas = <HTMLCanvasElement>(
      document.getElementById('circular-sine-stimulus-background')
    );

    // Choose the next frame randomly until it is not the same frame as the
    // currently displayed
    do {
      newFrameIndex = Math.floor(Math.random() * frames.length);
    } while (newFrameIndex === frameIndex);
    frameIndex = newFrameIndex;

    // Instanciate the image object which will be rendered onto the canvas
    const image = new Image();
    image.src = frames[frameIndex];

    // Set canvas size to image size
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    // And draw the image
    canvas.getContext('2d').drawImage(image, 0, 0);
  };

  // Instanciate the animation loop object and start the loop
  const animationLoop = new AnimationLoop(fps, animationFunction);
  animationLoop.startLoop();

  // Return the canvas and the animation loop handle
  return {
    canvas,
    animationLoop,
  };
};

/**
 * Creates an HTMLDivElement to be used as the stimulus and background
 * container based on the requested stimulus size
 *
 * @param size Size of the container
 * @returns The container as an HTMLDivElement
 */
const setUpContainer = (size: number): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = 'circular-sine-stimulus-container';
  container.style['position'] = 'relative';
  container.style['width'] = `${size}px`;
  container.style['height'] = `${size}px`;

  return container;
};

export default GaborStimulusPlugin;
