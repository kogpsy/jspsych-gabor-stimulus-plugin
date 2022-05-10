/**
 * GaborStimulusPlugin
 *
 * A jsPsych plugin to generate gabor patch stimuli.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 */

// Import jsPsych related code
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';
import AnimationLoop from './AnimationLoop';

// Define a type for the background property
type Background = {
  type: 'animation' | 'image' | 'css-color';
  imageSrc?: string;
  color?: string;
  frames?: string[];
  fps?: number;
  blendMode?: 'string';
};

// Define plugin info
const info = <const>{
  name: 'gabor-stimulus-plugin',
  parameters: {
    size: {
      type: ParameterType.INT,
      default: 200,
    },
    density: {
      type: ParameterType.INT,
      default: 1,
    },
    phaseOffset: {
      type: ParameterType.INT,
      default: 0,
    },
    opacity: {
      type: ParameterType.FLOAT,
      default: 1,
    },
    rotation: {
      type: ParameterType.INT,
      default: 0,
    },
    apertureRadius: {
      type: ParameterType.INT,
      default: '-1',
    },
    apertureBlur: {
      type: ParameterType.INT,
      default: '-1',
    },
    choices: {
      type: ParameterType.KEYS,
      default: [''],
    },
    background: {
      type: ParameterType.OBJECT,
      default: {
        type: 'css-color',
        color: 'transparent',
      },
    },
  },
};

// Derive type from plugin info
type Info = typeof info;

/**
 * **gabor-stimulus-plugin**
 *
 * A jsPsych plugin to generate circular sine stimuli (also known as bullseye
 * stimuli).
 *
 * @author Robin Bürkli
 * @see {@link https://github.com/kogpsy/jspsych-circular-sine-stimulus-plugin Documentation}
 */
class GaborStimulusPlugin implements JsPsychPlugin<Info> {
  static info = info;

  // Constructor
  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    // First clear the display element
    display_element.innerHTML = '';

    // Destructure, rename and cast the trial parameters into a more desirable
    // form
    const {
      size,
      density,
      phaseOffset,
      opacity,
      rotation,
      apertureRadius,
      apertureBlur,
      choices,
      background: backgroundProperties,
    } = <
      {
        size: number;
        density: number;
        phaseOffset: number;
        opacity: number;
        rotation: number;
        apertureRadius: number;
        apertureBlur: number;
        choices: string[];
        background: Background;
      }
    >trial;

    // Create the container for everything
    const container = setUpContainer(size);

    // Generate the stimulus as SVG
    const svg = generateSvgStimulus(
      size,
      density,
      phaseOffset,
      opacity,
      rotation,
      apertureRadius,
      apertureBlur,
      backgroundProperties.blendMode
    );

    // Add SVG to container
    container.appendChild(svg);

    // Create the background based on the received properties
    const { backgroundContainer, animationLoop } =
      setUpBackground(backgroundProperties);

    // Add canvas to container
    container.appendChild(backgroundContainer);

    // Create a temporary parent div, since the DOM only seems to get updated
    // when setting the new elements using innerHTML(), but not append.
    const tmpParent = document.createElement('div');
    tmpParent.appendChild(container);
    // Then update the DOM
    display_element.innerHTML = tmpParent.innerHTML;

    // Handler for key strokes
    const handleKeyResponse = (info) => {
      // If the background is animated, end animation
      if (backgroundProperties.type === 'animation') {
        animationLoop?.stopLoop();
      }

      // Clear display
      display_element.innerHTML = '';

      // Create data object
      const data = {
        rt: info.rt,
        response: info.key,
      };

      // End trial
      this.jsPsych.finishTrial(data);
    };

    // Setup a listener to key strokes
    this.jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: handleKeyResponse,
      valid_responses: choices,
      persist: false,
    });
  }
}

const setUpBackground = (
  background: Background
): {
  backgroundContainer: HTMLDivElement;
  animationCanvas?: HTMLCanvasElement;
  animationLoop?: AnimationLoop;
} => {
  const backgroundContainer = document.createElement('div');
  backgroundContainer.style['position'] = 'absolute';
  backgroundContainer.style['left'] = '0';
  backgroundContainer.style['top'] = '0';
  backgroundContainer.style['width'] = '100%';
  backgroundContainer.style['height'] = '100%';

  if (background.type === 'animation') {
    const { canvas, animationLoop } = setUpAnimationCanvas(
      background.frames,
      background.fps
    );

    backgroundContainer.appendChild(canvas);

    return {
      backgroundContainer,
      animationCanvas: canvas,
      animationLoop,
    };
  } else if (background.type === 'css-color') {
    backgroundContainer.style.backgroundColor = background.color;

    return {
      backgroundContainer,
    };
  } else if (background.type === 'image') {
    backgroundContainer.style.backgroundImage = `url("${background.imageSrc}")`;

    return { backgroundContainer };
  }
};

const setUpAnimationCanvas = (
  frames: string[],
  fps: number
): { canvas: HTMLCanvasElement; animationLoop: AnimationLoop } => {
  // Create the canvas for the background rendering (if animation)
  const canvas = document.createElement('canvas');
  canvas.id = 'circular-sine-stimulus-background';

  let frameIndex: number;
  let newFrameIndex: number;

  const animationFunction = () => {
    // For some reason the canvas element created above is undefined at this
    // point of the code lifecycle. I don't understand why, but retrieving the
    // instance in every frame is a functional workaround.
    const canvas = <HTMLCanvasElement>(
      document.getElementById('circular-sine-stimulus-background')
    );

    do {
      newFrameIndex = Math.floor(Math.random() * frames.length);
    } while (newFrameIndex === frameIndex);
    frameIndex = newFrameIndex;

    // @ts-ignore
    const image = new Image();
    image.src = frames[frameIndex];

    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    canvas.getContext('2d').drawImage(image, 0, 0);
  };

  const animationLoop = new AnimationLoop(fps, animationFunction);
  animationLoop.startLoop();

  return {
    canvas,
    animationLoop,
  };
};

// Create a container for the svg
const setUpContainer = (size: number): HTMLElement => {
  const container = document.createElement('div');
  container.id = 'circular-sine-stimulus-container';
  container.style['position'] = 'relative';
  container.style['width'] = `${size}px`;
  container.style['height'] = `${size}px`;

  return container;
};

// Create and setup SVG dom element
const generateSvgStimulus = (
  size: number,
  density: number,
  phaseOffset: number,
  opacity: number,
  rotation: number,
  apertureRadius: number,
  apertureBlur: number,
  blendMode: string
): HTMLElement => {
  // // Container
  // const container = document.createElement('div');
  // container.style['position'] = 'absolute';
  // container.style['left'] = '0';
  // container.style['top'] = '0';

  // // Gaussian part (mask)
  // const svgMask = document.createElement('svg');
  // svgMask.setAttribute('height', `${size}`);
  // svgMask.setAttribute('width', `${size}`);
  // svgMask.style['z-index'] = '1';

  // // Define svg tags for gaussian blur
  // const filter = document.createElement('filter');
  // filter.setAttribute('x', '-50%');
  // filter.setAttribute('y', '-50%');
  // filter.setAttribute('width', '200%');
  // filter.setAttribute('height', '200%');
  // filter.setAttribute('id', 'gaussian-blur');
  // const gaussianBlur = document.createElement('feGaussianBlur');
  // gaussianBlur.setAttribute('in', 'SourceGraphic');
  // gaussianBlur.setAttribute('stdDeviation', `${size / 8}`);

  // filter.appendChild(gaussianBlur);
  // svgMask.appendChild(filter);

  // // Circle for gaussian
  // const circleMask = document.createElement('circle');
  // circleMask.setAttribute('cx', `${size / 2}`);
  // circleMask.setAttribute('cy', `${size / 2}`);
  // circleMask.setAttribute('r', `${size / 4}`);
  // circleMask.setAttribute('stroke-width', '0');
  // circleMask.setAttribute('fill', 'white');
  // circleMask.setAttribute('filter', 'url(#gaussian-blur)');
  // svgMask.appendChild(circleMask);

  //
  //
  //
  //
  // ===================
  //
  //
  //
  //

  // Sine Part
  const svg = document.createElement('svg');
  svg.setAttribute('height', `${size}`);
  svg.setAttribute('width', `${size}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.style['opacity'] = `${opacity}`;
  svg.style['transform'] = `rotate(${rotation}deg)`;
  if (blendMode) {
    svg.style['mixBlendMode'] = blendMode;
  }
  svg.style['position'] = 'absolute';
  svg.style['left'] = '0';
  svg.style['top'] = '0';
  svg.style['z-index'] = 1;

  //svg.style.mixBlendMode = 'overlay';

  // Define rect with sine pattern
  const rect = document.createElement('rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', `${size}`);
  rect.setAttribute('height', `${size}`);
  rect.setAttribute('fill', 'url(#gradient)');
  rect.setAttribute('mask', 'url(#mask)');
  svg.appendChild(rect);

  // Define svg tags for gradient
  const defs = document.createElement('defs');
  const linearGradient = document.createElement('linearGradient');
  linearGradient.setAttribute('id', 'gradient');
  linearGradient.setAttribute('x1', '0');
  linearGradient.setAttribute('y1', '0');
  linearGradient.setAttribute('x2', '0');
  linearGradient.setAttribute('y2', '1');

  // Define mask
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

  mask.appendChild(maskCircle);
  defs.appendChild(mask);

  // Define gaussian filter
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

  filter.appendChild(gaussianBlur);
  defs.appendChild(filter);

  // Define sine save

  // Initialize loop varialbes
  let sineArgument: number,
    sineAtArgument: number,
    standardizedSine: number,
    circleColor: number,
    circleColorString;

  for (let i = 1; i <= 100; i++) {
    const stop = document.createElement('stop');
    stop.setAttribute('offset', `${i}%`);

    // Calculate properties
    // - Calculate the sine argument in degrees
    // - Shift by 90 degrees so that the standardized sine will start at 1
    //   which results in a white color.
    sineArgument =
      (Math.PI / 180) * ((360 / 100) * (i * density) + 90 + phaseOffset);
    sineAtArgument = Math.sin(sineArgument);

    standardizedSine = (sineAtArgument + 1) / 2;

    // If white circles are requested, invert the color
    circleColor = standardizedSine * 255;
    circleColorString = `rgb(${circleColor},${circleColor},${circleColor})`;

    stop.setAttribute('stop-color', circleColorString);

    linearGradient.appendChild(stop);
  }

  defs.appendChild(linearGradient);
  svg.appendChild(defs);
  //container.appendChild(svg);
  //container.appendChild(svgMask);

  return svg; //container;
};

export default GaborStimulusPlugin;
