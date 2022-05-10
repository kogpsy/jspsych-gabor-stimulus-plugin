/**
 * ConfigParser
 *
 * Parse provided to internal configs.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

// Define provided config type
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
  choices?: string[];
};

// Define internal config type
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
  choices: string[];
};

/**
 * Takes a possibly incomplete config and fills in defaults where necessary
 *
 * @param config The config provided by consumer
 * @returns A config filled with defaults where necessary
 */
export const parseConfig = (config: ProvidedConfig): InternalConfig => {
  // Define result object with defaults

  // TODO: set defaults if empty conf object was provided
  let parsedConfig: InternalConfig;

  // Destructure provided config
  const { stimulus, aperture, background, choices } = config;

  // Parse stimulus config
  if (stimulus) {
    // Destructure provided stimulus config
    const { size, density, phaseOffset, opacity, rotation, blendMode } =
      stimulus;

    if (size) {
      parsedConfig.stimulus.size = size;
    } else {
      parsedConfig.stimulus.size = 200;
    }

    if (density) {
      parsedConfig.stimulus.density = density;
    } else {
      parsedConfig.stimulus.density = 5;
    }

    if (phaseOffset) {
      parsedConfig.stimulus.phaseOffset = phaseOffset;
    } else {
      parsedConfig.stimulus.phaseOffset = 0;
    }

    if (opacity) {
      parsedConfig.stimulus.opacity = opacity;
    } else {
      parsedConfig.stimulus.opacity = 1;
    }

    if (rotation) {
      parsedConfig.stimulus.rotation = rotation;
    } else {
      parsedConfig.stimulus.rotation = 0;
    }

    if (blendMode) {
      parsedConfig.stimulus.blendMode = blendMode;
    } else {
      parsedConfig.stimulus.blendMode = 'normal';
    }
  }

  // Parse apperture config
  if (aperture) {
    // Destructure provided aperture config
    const { radius, blur } = aperture;

    if (radius) {
      parsedConfig.aperture.radius = radius;
    } else {
      parsedConfig.aperture.radius = parsedConfig.stimulus.size / 4;
    }
    if (blur) {
      parsedConfig.aperture.blur = blur;
    } else {
      parsedConfig.aperture.blur = parsedConfig.stimulus.size / 8;
    }
  }

  // Parse choices config
  if (choices) {
    parsedConfig.choices = choices;
  } else {
    parsedConfig.choices = [' '];
  }

  // Parse background config
  if (background) {
    if (background.type === 'animation') {
      const fps = background.fps ? background.fps : 60;
      parsedConfig.background = {
        type: 'animation',
        frames: background.frames,
        fps: fps,
      };
    } else if (background.type === 'css-color') {
      parsedConfig.background = background;
    } else if (background.type === 'image') {
      parsedConfig.background = background;
    }
  } else {
    parsedConfig.background = {
      type: 'css-color',
      color: 'transparent',
    };
  }

  return parsedConfig;
};
