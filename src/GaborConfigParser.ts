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
