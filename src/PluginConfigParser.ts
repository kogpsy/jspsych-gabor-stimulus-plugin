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
    visibility?: number;
    rotation?: number;
  };
  fixation_cross?: {
    size?: number;
    weight?: number;
    color?: string;
  };
  timing?: {
    stimulus_duration?: number;
    trial_duration?: number;
    response_ends_trial?: boolean;
  };
};

/**
 * Type for the internal, complete configuration. The provided configuration
 * will be parsed into this form.
 */
export type InternalConfig = {
  stimulus: {
    visibility: number;
    rotation: number;
  };
  fixation_cross: {
    display: boolean;
    size: number;
    weight: number;
    color: string;
  };
  timing: {
    stimulus_duration: number;
    trial_duration: number;
    response_ends_trial: boolean;
  };
};

// Defaults

// Stimulus defaults
const DEFAULT_STIMULUS_VISIBILITY = 1;
const DEFAULT_STIMULUS_ROTATION = 0;

// Fixation defaults
const DEFAULT_FIXATION_DISPLAY = false;
const DEFAULT_FIXATION_SIZE = 30;
const DEFAULT_FIXATION_WEIGHT = 5;
const DEFAULT_FIXATION_COLOR = 'white';

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
      visibility: DEFAULT_STIMULUS_VISIBILITY,
      rotation: DEFAULT_STIMULUS_ROTATION,
    },
    fixation_cross: {
      display: DEFAULT_FIXATION_DISPLAY,
      size: DEFAULT_FIXATION_SIZE,
      weight: DEFAULT_FIXATION_WEIGHT,
      color: DEFAULT_FIXATION_COLOR,
    },
    timing: {
      stimulus_duration: DEFAULT_TIMING_STIMULUS_DURATION,
      trial_duration: DEFAULT_TIMING_TRIAL_DURATION,
      response_ends_trial: DEFAULT_TIMING_RESPONSE_ENDS_TRIAL,
    },
  };

  // Then override if values are provided

  // Parse stimulus config
  if (providedConfig.stimulus !== undefined) {
    // Override stimulus visibility if provided
    if (providedConfig.stimulus.visibility !== undefined) {
      parsedConfig.stimulus.visibility = providedConfig.stimulus.visibility;
    }
    // Override stimulus rotation if provided
    if (providedConfig.stimulus.rotation !== undefined) {
      parsedConfig.stimulus.rotation = providedConfig.stimulus.rotation;
    }
  }

  // Parse fixation cross config
  if (providedConfig.fixation_cross !== undefined) {
    // Override display
    parsedConfig.fixation_cross.display = true;
    // Override fixation cross size if provided
    if (providedConfig.fixation_cross.size !== undefined) {
      parsedConfig.fixation_cross.size = providedConfig.fixation_cross.size;
    }
    // Override fixation cross weight if provided
    if (providedConfig.fixation_cross.weight !== undefined) {
      parsedConfig.fixation_cross.weight = providedConfig.fixation_cross.weight;
    }
    // Override fixation cross color if provided
    if (providedConfig.fixation_cross.color !== undefined) {
      parsedConfig.fixation_cross.color = providedConfig.fixation_cross.color;
    }
  }

  // Parse timing config
  if (providedConfig.timing !== undefined) {
    // Override stimulus duration if provided
    if (providedConfig.timing.stimulus_duration !== undefined) {
      parsedConfig.timing.stimulus_duration =
        providedConfig.timing.stimulus_duration;
    }
    // Override trial duration if provided
    if (providedConfig.timing.trial_duration !== undefined) {
      parsedConfig.timing.trial_duration = providedConfig.timing.trial_duration;
    }
    // Override response ends trial if provided
    if (providedConfig.timing.response_ends_trial !== undefined) {
      parsedConfig.timing.response_ends_trial =
        providedConfig.timing.response_ends_trial;
    }
  }

  // Return the result
  return parsedConfig;
};
