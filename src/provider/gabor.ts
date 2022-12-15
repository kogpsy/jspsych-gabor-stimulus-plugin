import * as PIXI from 'pixi.js';

type GaborConfig = {
  /** Size of the gabor in pixels */
  size: number;
  /** Density of the sinusodial pattern */
  density: number;
  /** Phase offset in degrees. 180 means inverted */
  phaseOffset: number;
  /** Blur strength from 0 to 1 */
  blur: number;
};

/**
 * Generates a gabor patch based on configuration object
 *
 * @param param0 Configuration
 * @param renderer Pixi renderer used to generate textures
 * @returns A DisplayObject containing a ready-to-use gabor
 */
export const generateGabor = (
  { size, density, phaseOffset: offset, blur }: GaborConfig,
  renderer: PIXI.IRenderer<PIXI.ICanvas>
): PIXI.Container<PIXI.DisplayObject> => {
  // Create the main sprite
  let gaborSprite = new PIXI.Sprite();

  // Create the sinusoid sprite and add it to the container
  let gabor = getSinusoid(size, density, offset, renderer);
  gaborSprite.addChild(gabor);

  // Create the gaussian mask and add it to the container
  const gaussianMask = getGaussianMask(size, blur, renderer);
  gabor.mask = gaussianMask;

  // Shift the pivot point to center
  gaborSprite.pivot.x = size / 2;
  gaborSprite.pivot.y = size / 2;
  gaborSprite.position.x = size / 2;
  gaborSprite.position.y = size / 2;

  return gaborSprite;
};

/**
 * Generate a texture mask to apply to the sinusoid pattern
 *
 * @param size The size of the gabor
 * @param blur The blur strength (0 - 100)
 * @param renderer The Pixi renderer (used to create a texture from graphic)
 * @returns Ready-to-use sprite
 */
const getGaussianMask = (
  size: number,
  blur: number,
  renderer: PIXI.IRenderer<PIXI.ICanvas>
): PIXI.Sprite => {
  // Filter circle's radius
  const filterRadius = size / 2;

  // Scale the actual max blur (which is defaulted to here as 3/8's the size)
  // to a 0 to 100 system.
  const maxBlur = size * (3 / 8);
  const effectiveBlur = (maxBlur / 100) * blur * 100;

  // Create the circle and filters
  const circle = new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(size / 2, size / 2, filterRadius - effectiveBlur * (4 / 7))
    .endFill();
  circle.filters = [new PIXI.filters.BlurFilter(effectiveBlur, 32)];
  // Generate a texture from the graphics for faster rendering
  const texture = renderer.generateTexture(circle, {
    region: new PIXI.Rectangle(0, 0, size, size),
  });
  const sprite = new PIXI.Sprite(texture);

  return sprite;
};

/**
 * Fills a rectangle pixel by pixel with a black-white sinusodial color gradient
 *
 * @param size The size of the desired sinusoid
 * @param density The density of the sinusoid (e.g.: if 2, the sine is doubled)
 * @param offset Phase offset of the sine
 * @returns A Pixi Graphics instance
 */
const getSinusoid = (
  size: number,
  density: number,
  offset: number,
  renderer: PIXI.IRenderer<PIXI.ICanvas>
): PIXI.Sprite => {
  let gabor = new PIXI.Graphics();
  for (let i = 0; i < size; i++) {
    // Calculate color for the current position
    const b = calculateColor((360 / size) * i, density, offset);
    // Fill the current position
    gabor.beginFill(b);
    gabor.drawRect(0, i, size, 1);
    gabor.endFill();
  }
  // Generate a texture from the graphics for faster rendering
  const texture = renderer.generateTexture(gabor);
  return new PIXI.Sprite(texture);
};

/**
 * Calculates the color on a certain position of a parametrized sine wave
 *
 * @param position The position on the sine in degrees
 * @param density Density of the sine (e.g.: if 2, the sine is doubled)
 * @param phaseOffset Offset of the sine in degrees
 * @returns A valid color number
 */
const calculateColor = (
  position: number,
  density: number,
  phaseOffset: number
): number => {
  // Transform the parameters to a valid radian (position on the sine wave)
  const sineArgument = (Math.PI / 180) * (position * density + phaseOffset);
  // Obtain the value of the sine wave at that position
  const sineAtArgument = Math.sin(sineArgument);
  // Transform the scale from (-1 .. 1) to (0 .. 1)
  const transformedSine = (sineAtArgument + 1) / 2;
  // Return the greyscale color based on the transformed sine value
  return PIXI.utils.rgb2hex([
    transformedSine,
    transformedSine,
    transformedSine,
  ]);
};
