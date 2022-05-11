/**
 * FixationCrossGen
 *
 * Generate fixation crosses as SVGElements.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

/**
 * Generate an SVG based fixation cross
 *
 * @param stimulusSize The size of the actual stimulus (the fixation cross will
 * be displayed centered)
 * @param fixationCrossSize The size of the fixation cross (height and width)
 * @param fixationCrossWeight The fixation cross weight
 * @param fixationCrossColor The fixation cross color
 * @returns The generated fixation cross as an HTMLElement (SVG)
 */
export const generateFixationCross = (
  stimulusSize: number,
  fixationCrossSize: number,
  fixationCrossWeight: number,
  fixationCrossColor: string
): HTMLElement => {
  // Create and setup the stimulus element
  const svg = document.createElement('svg');
  svg.setAttribute('height', `${stimulusSize}`);
  svg.setAttribute('width', `${stimulusSize}`);
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  svg.style.zIndex = '2';

  // Create the horizontal line object and set its attributes
  const horizontalLine = document.createElement('line');
  horizontalLine.setAttribute('stroke-width', `${fixationCrossWeight}`);
  horizontalLine.setAttribute('stroke', fixationCrossColor);
  horizontalLine.setAttribute('x1', `${stimulusSize / 2}`);
  horizontalLine.setAttribute(
    'y1',
    `${stimulusSize / 2 - fixationCrossSize / 2}`
  );
  horizontalLine.setAttribute('x2', `${stimulusSize / 2}`);
  horizontalLine.setAttribute(
    'y2',
    `${stimulusSize / 2 + fixationCrossSize / 2}`
  );

  // Create the vertical line object and set its attributes
  const verticalLine = document.createElement('line');
  verticalLine.setAttribute('stroke-width', `${fixationCrossWeight}`);
  verticalLine.setAttribute('stroke', fixationCrossColor);
  verticalLine.setAttribute('y1', `${stimulusSize / 2}`);
  verticalLine.setAttribute(
    'x1',
    `${stimulusSize / 2 - fixationCrossSize / 2}`
  );
  verticalLine.setAttribute('y2', `${stimulusSize / 2}`);
  verticalLine.setAttribute(
    'x2',
    `${stimulusSize / 2 + fixationCrossSize / 2}`
  );

  // Append lines to svg
  svg.appendChild(horizontalLine);
  svg.appendChild(verticalLine);

  // Return generated svg
  return svg;
};
