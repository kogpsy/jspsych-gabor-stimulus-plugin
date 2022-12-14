/**
 * GaborStimulusPlugin
 *
 * A jsPsych plugin to generate gabor patch stimuli.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

// Import pixi
import * as PIXI from 'pixi.js';

// Import jsPsych related code
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';
import { InternalConfig, parseConfig } from './ConfigParser';
import { generateFixationCross } from './fixcross';
import {
  GaborConfig,
  GaborPluginProvider,
  parseConfig as parseGaborConfig,
  ParsedGaborConfig,
} from './provider/provider';
import { generateGabor } from './provider/gabor';
import { generateNoiseFrames } from './provider/noise';

let pixiApplication: PIXI.Application<HTMLCanvasElement>;
let gaborConfig: ParsedGaborConfig;

export const initializeGaborPlugin = (config: GaborConfig) => {
  const parsedConfig = parseGaborConfig(config);
  gaborConfig = parsedConfig;
  const { size, density, phaseOffset, blur } = parsedConfig;

  // Create the pixi application
  pixiApplication = new PIXI.Application<HTMLCanvasElement>({
    width: size,
    height: size,
    backgroundAlpha: 0,
    autoStart: false,
  });

  // Create the universal gabor patch
  const gabor = generateGabor(
    {
      size,
      density,
      phaseOffset,
      blur,
    },
    pixiApplication.renderer
  );

  // Generate noise frames
  const noiseFrames = generateNoiseFrames({
    size: size,
    numberOfFrames: 100,
    renderer: pixiApplication.renderer,
  });

  const noiseContainer = new PIXI.Container();
  let noiseIndex = 0;
  noiseContainer.addChild(noiseFrames[noiseIndex]);
  pixiApplication.stage.addChild(noiseContainer);

  pixiApplication.stage.addChild(gabor);

  let elapsed = 0;

  pixiApplication.ticker.add((dt: number) => {
    elapsed += dt;

    if (elapsed > 4) {
      noiseContainer.removeChildren();
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * noiseFrames.length);
      } while (newIndex == noiseIndex);
      noiseIndex = newIndex;
      noiseContainer.addChild(noiseFrames[noiseIndex]);

      elapsed = 0;
    }
  });
};

// Define plugin info
const info: any = <const>{
  name: 'gabor-stimulus-plugin',
  parameters: {
    options: {
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
    if (!pixiApplication || !gaborConfig) {
      throw Error(
        'You must call the initializeGaborPlugin() method before adding trial to the timeline.'
      );
    }

    // First clear the display element
    display_element.innerHTML = '';

    // Parse the provided config into a consistent format
    const config: InternalConfig = parseConfig(trial.config);
    const choices: string[] = trial.choices;

    pixiApplication.start();

    // Create the container for everything
    const container = setUpContainer(gaborConfig.size);
    container.appendChild(pixiApplication.view);

    // Add fixation cross if requested
    if (config.fixation_cross.display) {
      const fixationCross = generateFixationCross(
        gaborConfig.size,
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

    // Start trial duration clock. This will end the trial after the provided
    // trial duration (if one was provided)
    if (config.timing.trial_duration > 0) {
      this.trialTimeout = setTimeout(() => {
        // End trial
        this.endTrial(display_element, pixiApplication.stop);
      }, config.timing.trial_duration);
    }

    // Start stimulus duration clock. This will hide the stimulus after the
    // provided duration (if one was provided)
    if (config.timing.stimulus_duration > 0) {
      this.stimulusTimeout = setTimeout(() => {
        // Hide the whole display element
        display_element.style.opacity = '0';
        pixiApplication.stop();
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
        this.endTrial(display_element, pixiApplication.stop);
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
  endTrial(display_element: HTMLElement, stopRender: () => void) {
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
    // Stop pixi render
    stopRender();
    // End trial
    this.jsPsych.finishTrial({
      rt: this.reactionTime,
      response: this.response,
    });
  }
}

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
