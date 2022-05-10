/**
 * GaborGen
 *
 * Generate gabor patches as SVGElements.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

// Define gradient resolution constant. A value of 100 means there will be 100
// SVGStopElements used to create the gradient.
// Default: 100
const GRADIENT_RESOLUTION = 100;

// Create and setup SVG dom element
export const generateGabor = (
  size: number,
  density: number,
  phaseOffset: number,
  opacity: number,
  rotation: number,
  apertureRadius: number,
  apertureBlur: number,
  blendMode: string
): HTMLElement => {
  // Create the main svg element and set size
  const svg = document.createElement('svg');
  svg.setAttribute('height', `${size}`);
  svg.setAttribute('width', `${size}`);

  // Set css styling of main svg element
  svg.style.opacity = `${opacity}`;
  // Rotation is implemented using css transform
  svg.style.transform = `rotate(${rotation}deg)`;
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  svg.style.zIndex = '1';
  // If a blend mode is provided through the config, set it
  if (blendMode) {
    svg.style.mixBlendMode = blendMode;
  }

  // Define a rect element. This will be filled with a sine pattern later.
  const rect = document.createElement('rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', `${size}`);
  rect.setAttribute('height', `${size}`);
  rect.setAttribute('fill', 'url(#gradient)');
  rect.setAttribute('mask', 'url(#mask)');
  // Append rect to svg
  svg.appendChild(rect);

  // Define the gradient element for the sine pattern. Its 'stop' elements are
  // generated later.
  const defs = document.createElement('defs');
  const linearGradient = document.createElement('linearGradient');
  linearGradient.setAttribute('id', 'gradient');
  linearGradient.setAttribute('x1', '0');
  linearGradient.setAttribute('y1', '0');
  linearGradient.setAttribute('x2', '0');
  linearGradient.setAttribute('y2', '1');

  // Define the mask element for the aperture
  const mask = document.createElement('mask');
  mask.setAttribute('id', 'mask');
  const maskCircle = document.createElement('circle');
  maskCircle.setAttribute('cx', `${size / 2}`);
  maskCircle.setAttribute('cy', `${size / 2}`);
  // If aperture size is not set, default to 1/4 of size
  maskCircle.setAttribute(
    'r',
    Number(apertureRadius) === -1 ? `${size / 4}` : `${Number(apertureRadius)}`
  );
  maskCircle.setAttribute('fill', 'white');
  maskCircle.setAttribute('filter', 'url(#gaussian-blur)');
  // Append circle to mask and mask to defs
  mask.appendChild(maskCircle);
  defs.appendChild(mask);

  // Define the filter element to blur the aperture in a gaussian way
  const filter = document.createElement('filter');
  filter.setAttribute('id', 'gaussian-blur');
  filter.setAttribute('x', '-50%');
  filter.setAttribute('y', '-50%');
  filter.setAttribute('width', '200%');
  filter.setAttribute('height', '200%');
  const gaussianBlur = document.createElement('feGaussianBlur');
  // If aperture blur is not set, default to 1/8 of size
  gaussianBlur.setAttribute(
    'stdDeviation',
    Number(apertureBlur) === -1 ? `${size / 8}` : `${Number(apertureBlur)}`
  );
  // Append gaussian blur to filter and filter to defs
  filter.appendChild(gaussianBlur);
  defs.appendChild(filter);

  // Generate the stop elements for the gradient
  for (let i = 1; i <= GRADIENT_RESOLUTION; i++) {
    // Define the element
    const stop = document.createElement('stop');
    stop.setAttribute('offset', `${i}%`);
    // Calculate the color based on a parametrized sine wave
    const color = calculateColor(
      (360 / GRADIENT_RESOLUTION) * i,
      density,
      phaseOffset
    );
    // Set the color
    stop.setAttribute('stop-color', color);
    // And append the element to the gradient
    linearGradient.appendChild(stop);
  }

  // Append gradient to defs and defs to svg
  defs.appendChild(linearGradient);
  svg.appendChild(defs);
  // And return svg
  return svg;
};

/**
 * Calculates the color on a certain position of a parametrized sine wave
 *
 * @param position The position on the sine in degrees
 * @param density Density of the sine (e.g.: if 2, the sine is doubled)
 * @param phaseOffset Offset of the sine in degrees
 * @returns A valid css color string
 */
const calculateColor = (
  position: number,
  density: number,
  phaseOffset: number
): string => {
  // Transform the parameters to a valid radian (position on the sine wave)
  const sineArgument = (Math.PI / 180) * (position * density + phaseOffset);
  // Obtain the value of the sine wave at that position
  const sineAtArgument = Math.sin(sineArgument);
  // Transform the scale from (-1 .. 1) to (0 .. 1)
  const transformedSine = (sineAtArgument + 1) / 2;
  // Calculate the greyscale color based on the transformed sine value
  const circleColor = transformedSine * 255;
  // And transform this color into a css color string, then return
  return `rgb(${circleColor},${circleColor},${circleColor})`;
};
