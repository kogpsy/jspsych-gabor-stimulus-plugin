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
import { generateFixationCross } from './FixationCrossGen';
import { generateGabor } from './GaborGen';
import PluginEvent from './PluginEvent';

// Define plugin info
const info: any = <const>{
  name: 'gabor-stimulus-plugin',
  parameters: {
    config: {
      type: ParameterType.OBJECT,
      default: undefined,
    },
    choices: {
      type: ParameterType.KEYS,
      default: [''],
    },
  },
};

// Derive type from plugin info
type Info = typeof info;

const domInitializedEvent = new PluginEvent();

/**
 * **gabor-stimulus-plugin**
 *
 * A jsPsych plugin to generate gabor patch stimuli.
 *
 * @author Robin Bürkli
 * @see {@link https://github.com/kogpsy/jspsych-gabor-stimulus-plugin Documentation}
 */
class GaborStimulusPlugin implements JsPsychPlugin<Info> {
  // Add static info
  static info = info;

  // Class variables for data collection
  private participantDidRespond: boolean = false;
  private reactionTime: number = undefined;
  private response: string = undefined;

  // Class variables for stimulus and trial timeouts
  private stimulusTimeout: NodeJS.Timeout = undefined;
  private trialTimeout: NodeJS.Timeout = undefined;

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
    const choices: string[] = trial.choices;

    // Create the container for everything
    const container = setUpContainer(config.stimulus.size);

    // Generate the stimulus as SVG
    const svg = generateGabor(
      config.stimulus.size,
      config.stimulus.density,
      config.stimulus.density,
      config.stimulus.opacity,
      config.stimulus.rotation,
      config.stimulus.blend_mode,
      config.aperture.radius,
      config.aperture.blur
    );

    // Add SVG to container
    container.appendChild(svg);

    // Create the background based on the received properties
    const { backgroundContainer, animationLoop } = setUpBackground(config);

    // Add canvas to container
    container.appendChild(backgroundContainer);

    // Add fixation cross if requested
    if (config.fixation_cross.display) {
      const fixationCross = generateFixationCross(
        config.stimulus.size,
        config.fixation_cross.size,
        config.fixation_cross.weight,
        config.fixation_cross.color
      );
      container.appendChild(fixationCross);
    }

    // Create a temporary parent div, since the DOM only seems to get updated
    // when setting the new elements using innerHTML(), but not append.
    const tmpParent = document.createElement('div');
    tmpParent.appendChild(container);

    // Then update the DOM
    display_element.innerHTML = tmpParent.innerHTML;

    // Trigger dom setup event
    domInitializedEvent.trigger();

    // Start trial duration clock. This will end the trial after the provided
    // trial duration (if one was provided)
    if (config.timing.trial_duration > 0) {
      this.trialTimeout = setTimeout(() => {
        // End trial
        this.endTrial(
          display_element,
          config.background.type === 'animation',
          animationLoop
        );
      }, config.timing.trial_duration);
    }

    // Start stimulus duration clock. This will hide the stimulus after the
    // provided duration (if one was provided)
    if (config.timing.stimulus_duration > 0) {
      this.stimulusTimeout = setTimeout(() => {
        // Hide the whole display element

        // NOTE: MUST BE SOMEWHERE HERE

        display_element.style.opacity = '0';
        if (config.background.type === 'animation') {
          animationLoop.stopLoop();
        }
      }, config.timing.stimulus_duration);
    }

    // Handler for key strokes
    const handleKeyResponse = (info: any) => {
      // Store data to class variable
      if (!this.participantDidRespond) {
        this.reactionTime = info.rt;
        this.response = info.key;
      }

      // End trial if response ends trial
      if (config.timing.response_ends_trial) {
        this.endTrial(
          display_element,
          config.background.type === 'animation',
          animationLoop
        );
      }
    };

    // Setup a listener to key strokes
    this.jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: handleKeyResponse,
      valid_responses: choices,
      persist: false,
    });
  }

  /**
   * Clears the display element, stops the animation loop if running, and ends the
   * trial.
   *
   * @param displayElement jsPsych display element
   * @param backgroundIsAnimation Is the background animated?
   * @param animationLoop AnimationLoop instance
   */
  endTrial(
    display_element: HTMLElement,
    backgroundIsAnimation: boolean,
    animationLoop: AnimationLoop
  ) {
    // Clear dom initialized event
    domInitializedEvent.clear();
    // Clear timeouts if set
    if (this.stimulusTimeout) {
      clearTimeout(this.stimulusTimeout);
    }
    if (this.trialTimeout) {
      clearTimeout(this.trialTimeout);
    }
    // Clear and reset display element
    display_element.innerHTML = '';
    display_element.style.opacity = '';
    // If the background is animated, end animation
    if (backgroundIsAnimation) {
      animationLoop?.stopLoop();
    }
    // End trial
    this.jsPsych.finishTrial({
      rt: this.reactionTime,
      response: this.response,
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
    // Create the canvas to render background image on
    const canvas = document.createElement('canvas');
    canvas.id = 'gabor-stimulus-background';
    // Instanciate the image object which will be rendered onto the canvas
    const image = new Image();
    image.src = config.background.source;

    // Set canvas size to image size
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;

    // When the dom has been initialized, grab the canvas and draw the
    // background
    domInitializedEvent.subscribe(() => {
      // Get background. Must be done in this way, since the canvas is not added
      // to the dom immediately.
      const cv = document.getElementById('gabor-stimulus-background');
      // And draw the image
      (cv as HTMLCanvasElement).getContext('2d').drawImage(image, 0, 0);
    });

    // Finally, append background to container
    backgroundContainer.appendChild(canvas);

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
  canvas.id = 'gabor-stimulus-background';

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
      document.getElementById('gabor-stimulus-background')
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

  // Start the loop when the dom has been initialized completely
  domInitializedEvent.subscribe(() => {
    animationLoop.startLoop();
  });

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
  container.id = 'gabor-stimulus-container';
  container.style['position'] = 'relative';
  container.style['width'] = `${size}px`;
  container.style['height'] = `${size}px`;

  return container;
};

export default GaborStimulusPlugin;
