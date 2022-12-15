/**
 * FixationCrossGen
 *
 * Generate fixation crosses as SVGElements.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

import * as PIXI from 'pixi.js';
import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';

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
const generateSvgFixationCross = (
  stimulusSize: number,
  fixationCrossSize: number,
  fixationCrossWeight: number,
  fixationCrossColor: string
): HTMLElement => {
  // Create and setup the stimulus element
  const svg = document.createElement('svg');

  svg.style.width = `${fixationCrossSize}px`;
  svg.style.height = `${fixationCrossSize}px`;

  // Create the horizontal line object and set its attributes
  const horizontalLine = document.createElement('line');
  horizontalLine.setAttribute('stroke-width', `${fixationCrossWeight}`);
  horizontalLine.setAttribute('stroke', fixationCrossColor);
  horizontalLine.setAttribute('x1', `${fixationCrossSize / 2}`);
  horizontalLine.setAttribute(
    'y1',
    `${fixationCrossSize / 2 - fixationCrossSize / 2}`
  );
  horizontalLine.setAttribute('x2', `${fixationCrossSize / 2}`);
  horizontalLine.setAttribute(
    'y2',
    `${fixationCrossSize / 2 + fixationCrossSize / 2}`
  );

  // Create the vertical line object and set its attributes
  const verticalLine = document.createElement('line');
  verticalLine.setAttribute('stroke-width', `${fixationCrossWeight}`);
  verticalLine.setAttribute('stroke', fixationCrossColor);
  verticalLine.setAttribute('y1', `${fixationCrossSize / 2}`);
  verticalLine.setAttribute(
    'x1',
    `${fixationCrossSize / 2 - fixationCrossSize / 2}`
  );
  verticalLine.setAttribute('y2', `${fixationCrossSize / 2}`);
  verticalLine.setAttribute(
    'x2',
    `${fixationCrossSize / 2 + fixationCrossSize / 2}`
  );

  // Append lines to svg
  svg.appendChild(horizontalLine);
  svg.appendChild(verticalLine);

  // Return generated svg
  return svg;
};

export const generateFixationCrossTrial = (
  stimulusSize: number,
  fixationCrossSize: number,
  fixationCrossWeight: number,
  fixationCrossColor: string,
  duration: number
) => {
  const tmpContainer = document.createElement('div');
  tmpContainer.appendChild(
    generateSvgFixationCross(
      stimulusSize,
      fixationCrossSize,
      fixationCrossWeight,
      fixationCrossColor
    )
  );
  const htmlString = tmpContainer.innerHTML;
  return {
    type: HtmlKeyboardResponsePlugin,
    stimulus: htmlString,
    trial_duration: duration,
    choices: 'NO_KEYS',
    on_load: () => {
      const pluginContainer = document.getElementById(
        'jspsych-html-keyboard-response-stimulus'
      );
      pluginContainer.style.lineHeight = '0px';
      pluginContainer.style.fontSize = '0px';
    },
  };
};

export const generateFixationCross = (
  stimulusSize: number,
  fixationCrossSize: number,
  fixationCrossWeight: number,
  fixationCrossColor: string
) => {
  const container = new PIXI.Graphics();
  const color = PIXI.utils.string2hex(fixationCrossColor);
  container.beginFill(color);
  // Draw horizontal part
  container.drawRect(
    0,
    fixationCrossSize / 2 - fixationCrossWeight / 2,
    fixationCrossSize,
    fixationCrossWeight
  );
  // Draw vertical part
  container.drawRect(
    fixationCrossSize / 2 - fixationCrossWeight / 2,
    0,
    fixationCrossWeight,
    fixationCrossSize
  );
  container.endFill();
  container.x = stimulusSize / 2 - fixationCrossSize / 2;
  container.y = stimulusSize / 2 - fixationCrossSize / 2;
  return container;
};
