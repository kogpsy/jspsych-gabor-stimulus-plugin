/**
 * ConfigParser
 *
 * Parse provided to internal configs.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

/**
 * Type for the provided configuration. Can be used by consumers for
 * autocompletion and robustness purposes.
 */
export type ProvidedConfig = {
  stimulus?: {
    size?: number;
    density?: number;
    phaseOffset?: number;
    opacity?: number;
    rotation?: number;
    blendMode?: string;
  };
  aperture?: {
    radius?: number;
    blur?: number;
  };
  background?:
    | {
        type: 'animation';
        frames: string[];
        fps?: number;
      }
    | {
        type: 'css-color';
        color: string;
      }
    | {
        type: 'image';
        source: string;
      };
  fixationCross?: {
    size?: number;
    weight?: number;
    color?: string;
  };
  choices?: string[];
  timing?: {
    stimulusDuration?: number;
    trialDuration?: number;
    responseEndsTrial?: boolean;
  };
};

/**
 * Type for the internal, complete configuration. The provided configuration
 * will be parsed into this form.
 */
export type InternalConfig = {
  stimulus: {
    size: number;
    density: number;
    phaseOffset: number;
    opacity: number;
    rotation: number;
    blendMode: string;
  };
  aperture: {
    radius: number;
    blur: number;
  };
  background:
    | {
        type: 'animation';
        frames: string[];
        fps: number;
      }
    | {
        type: 'css-color';
        color: string;
      }
    | {
        type: 'image';
        source: string;
      };
  fixationCross: {
    display: boolean;
    size: number;
    weight: number;
    color: string;
  };
  choices: string[];
  timing: {
    stimulusDuration: number;
    trialDuration: number;
    responseEndsTrial: boolean;
  };
};

// Defaults

// Stimulus defaults
const DEFAULT_STMIULUS_SIZE = 200;
const DEFAULT_STIMULUS_DENSITY = 5;
const DEFAULT_STIMULUS_PHASE_OFFSET = 0;
const DEFAULT_STIMULUS_OPACITY = 1;
const DEFAULT_STIMULUS_ROTATION = 0;
const DEFAULT_STIMULUS_BLEND_MODE = 'normal';

// Aperture defaults
const DEFAULT_APERTURE_RADIUS = DEFAULT_STMIULUS_SIZE / 4;
const DEFAULT_APERTURE_BLUR = DEFAULT_STMIULUS_SIZE / 8;

// Background defaults
const DEFAULT_BACKGROUND_TYPE = 'css-color';
const DEFAULT_BACKGROUND_COLOR = 'transparent';
const DEFAULT_BACKGROUND_ANIMATION_FPS = 60;

// Fixation defaults
const DEFAULT_FIXATION_DISPLAY = false;
const DEFAULT_FIXATION_SIZE = 30;
const DEFAULT_FIXATION_WEIGHT = 5;
const DEFAULT_FIXATION_COLOR = 'white';

// Choices default
const DEFAULT_CHOICES = [''];

// Timing defaults
const DEFAULT_TIMING_STIMULUS_DURATION = 0;
const DEFAULT_TIMING_TRIAL_DURATION = 0;
const DEFAULT_TIMING_RESPONSE_ENDS_TRIAL = true;

/**
 * Takes a possibly incomplete config and fills in defaults where necessary
 *
 * @param providedConfig The config provided by consumer
 * @returns A config filled with defaults where necessary
 */
export const parseConfig = (providedConfig: ProvidedConfig): InternalConfig => {
  // Define result object with defaults
  let parsedConfig: InternalConfig = {
    stimulus: {
      size: DEFAULT_STMIULUS_SIZE,
      density: DEFAULT_STIMULUS_DENSITY,
      phaseOffset: DEFAULT_STIMULUS_PHASE_OFFSET,
      opacity: DEFAULT_STIMULUS_OPACITY,
      rotation: DEFAULT_STIMULUS_ROTATION,
      blendMode: DEFAULT_STIMULUS_BLEND_MODE,
    },
    aperture: {
      radius: DEFAULT_APERTURE_RADIUS,
      blur: DEFAULT_APERTURE_BLUR,
    },
    background: {
      type: DEFAULT_BACKGROUND_TYPE,
      color: DEFAULT_BACKGROUND_COLOR,
    },
    fixationCross: {
      display: DEFAULT_FIXATION_DISPLAY,
      size: DEFAULT_FIXATION_SIZE,
      weight: DEFAULT_FIXATION_WEIGHT,
      color: DEFAULT_FIXATION_COLOR,
    },
    choices: DEFAULT_CHOICES,
    timing: {
      stimulusDuration: DEFAULT_TIMING_STIMULUS_DURATION,
      trialDuration: DEFAULT_TIMING_TRIAL_DURATION,
      responseEndsTrial: DEFAULT_TIMING_RESPONSE_ENDS_TRIAL,
    },
  };

  // Then override if values are provided

  // Parse stimulus config
  if (providedConfig.stimulus !== undefined) {
    // Override stimulus size if provided
    if (providedConfig.stimulus.size !== undefined) {
      parsedConfig.stimulus.size = providedConfig.stimulus.size;
    }
    // Override stimulus density if provided
    if (providedConfig.stimulus.density !== undefined) {
      parsedConfig.stimulus.density = providedConfig.stimulus.density;
    }
    // Override stimulus phase offset if provided
    if (providedConfig.stimulus.phaseOffset !== undefined) {
      parsedConfig.stimulus.phaseOffset = providedConfig.stimulus.phaseOffset;
    }
    // Override stimulus opacity if provided
    if (providedConfig.stimulus.opacity !== undefined) {
      parsedConfig.stimulus.opacity = providedConfig.stimulus.opacity;
    }
    // Override stimulus rotation if provided
    if (providedConfig.stimulus.rotation !== undefined) {
      parsedConfig.stimulus.rotation = providedConfig.stimulus.rotation;
    }
    // Override stimulus blend mode if provided
    if (providedConfig.stimulus.blendMode !== undefined) {
      parsedConfig.stimulus.blendMode = providedConfig.stimulus.blendMode;
    }
  }

  // Parse apperture config
  if (providedConfig.aperture !== undefined) {
    // Override aperture radius if provided
    if (providedConfig.aperture.radius !== undefined) {
      parsedConfig.aperture.radius = providedConfig.aperture.radius;
    }
    // Override aperture blur if provided
    if (providedConfig.aperture.blur !== undefined) {
      parsedConfig.aperture.blur = providedConfig.aperture.blur;
    }
  }

  // Parse choices config
  if (providedConfig.choices !== undefined) {
    // Override choices if provided
    parsedConfig.choices = providedConfig.choices;
  }

  // Parse fixation cross config
  if (providedConfig.fixationCross !== undefined) {
    // Override display
    parsedConfig.fixationCross.display = true;
    // Override fixation cross size if provided
    if (providedConfig.fixationCross.size !== undefined) {
      parsedConfig.fixationCross.size = providedConfig.fixationCross.size;
    }
    // Override fixation cross weight if provided
    if (providedConfig.fixationCross.weight !== undefined) {
      parsedConfig.fixationCross.weight = providedConfig.fixationCross.weight;
    }
    // Override fixation cross color if provided
    if (providedConfig.fixationCross.color !== undefined) {
      parsedConfig.fixationCross.color = providedConfig.fixationCross.color;
    }
  }

  // Parse background config
  if (providedConfig.background !== undefined) {
    if (providedConfig.background.type === 'animation') {
      // If an animation was requested as background, check if FPS field was
      // provided, otherwise set to default.
      const fps =
        providedConfig.background.fps !== undefined
          ? providedConfig.background.fps
          : DEFAULT_BACKGROUND_ANIMATION_FPS;
      // Then construct background config object for internal config
      parsedConfig.background = {
        type: 'animation',
        frames: providedConfig.background.frames,
        fps: fps,
      };
    } else if (providedConfig.background.type === 'css-color') {
      // If a color was requested as background, set it accordingly
      parsedConfig.background = {
        type: 'css-color',
        color:
          providedConfig.background.color !== undefined
            ? providedConfig.background.color
            : 'transparent',
      };
    } else if (providedConfig.background.type === 'image') {
      // If an image was requested as background, set it accordingly
      parsedConfig.background = providedConfig.background;
    }
  }

  // Parse timing config
  if (providedConfig.timing !== undefined) {
    // Override stimulus duration if provided
    if (providedConfig.timing.stimulusDuration !== undefined) {
      parsedConfig.timing.stimulusDuration =
        providedConfig.timing.stimulusDuration;
    }
    // Override trial duration if provided
    if (providedConfig.timing.trialDuration !== undefined) {
      parsedConfig.timing.trialDuration = providedConfig.timing.trialDuration;
    }
    // Override response ends trial if provided
    if (providedConfig.timing.responseEndsTrial !== undefined) {
      parsedConfig.timing.responseEndsTrial =
        providedConfig.timing.responseEndsTrial;
    }
  }

  // Return the result
  return parsedConfig;
};
