export const generateFixationCross = (
  stimulusSize: number,
  fixationCrossSize: number,
  fixationCrossWeight: number,
  fixationCrossColor: string
): HTMLElement => {
  // Create the stimulus element
  const svg = document.createElement('svg');
  svg.setAttribute('height', `${stimulusSize}`);
  svg.setAttribute('width', `${stimulusSize}`);
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  svg.style.zIndex = '2';

  // Create the line objects
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

  svg.appendChild(horizontalLine);
  svg.appendChild(verticalLine);

  return svg;
};
