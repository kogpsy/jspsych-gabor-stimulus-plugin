import * as PIXI from 'pixi.js';
import { generateGabor } from './gabor';
import { generateNoiseFrames } from './noise';

/**
 * The necessary infrastructure to present gabors efficiently in the browser.
 */
export type GaborPluginProvider = {
  //pixiApplication: PIXI.Application<HTMLCanvasElement>;
  //gabor: PIXI.Container<PIXI.DisplayObject>;
  startRender: () => void;
  stopRender: () => void;
  gaborSize: number;
  view: HTMLCanvasElement;
};

/**
 * Configuration for the gabor
 */
export type GaborConfig = {
  /** The size of the gabor in pixels */
  size: number;
  /**
   * The density, as in how many times the sine is repeated
   * Values: positive numbers
   * Default: 6
   */
  density?: number;
  /**
   * The phase offset, or shift of the sine.
   * Values: degrees
   * Default: 0
   */
  phaseOffset?: number;
  /**
   * Strength of the blur applied to the circular aperture.
   * Values: numbers between 0 and 1
   * Default: 0.8
   * */
  blur?: number;
};

/** {@link GaborConfig} with default values */
export type ParsedGaborConfig = {
  size: number;
  density: number;
  phaseOffset: number;
  blur: number;
};

/**
 * Creates the required infrastructure to efficiently present gabors in the
 * browser using WebGL.
 *
 * - Initializes a WebGL context using Pixi
 * - Generates a gabor patch
 * - Generates noise frames
 *
 * @param gaborConfig Configuration of the gabor, see {@link GaborConfig}
 * @returns A {@link GaborPluginProvider} object
 */
export const createGaborPluginProvider = (
  gaborConfig: GaborConfig
): GaborPluginProvider => {
  const { size, density, phaseOffset, blur } = parseConfig(gaborConfig);

  // Create the pixi application
  const pixiApplication = new PIXI.Application<HTMLCanvasElement>({
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

  // And return the provider
  return {
    //pixiApplication,
    //gabor,
    startRender: pixiApplication.start,
    stopRender: pixiApplication.stop,
    gaborSize: size,
    view: pixiApplication.view,
  };
};

/**
 * Fill in default values where needed in the GaborConfig object
 *
 * @param gaborConfig GaborConfig provided by consumer
 * @returns GaborConfig parsed and filled with defaults where needed
 */
export const parseConfig = (gaborConfig: GaborConfig): ParsedGaborConfig => {
  return {
    size: gaborConfig.size,
    density: gaborConfig.density ?? 6,
    phaseOffset: gaborConfig.phaseOffset ?? 0,
    blur: gaborConfig.blur ?? 0.8,
  };
};
