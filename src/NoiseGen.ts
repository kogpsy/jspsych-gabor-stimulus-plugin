/**
 * NoiseGen
 *
 * Generate visual noise frames of a certain size.
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: GPL-3.0
 *
 */

/**
 * Generates a single visual noise frame
 * 
 * @param width Width of the frame
 * @param height Height of the frame
 * @returns The frame as a data url
 */
const generateNoise = (height: number, width: number): string => {
  // Use generateNoiseFrames() to generate a single frame
  return generateNoiseFrames(height, width, 1)[0];
};

/**
 * Generates multiple visual noise frames
 * 
 * @param width Width of the frame
 * @param height Height of the frame
 * @param numberOfFrames The number of frames which should be generated
 * @returns The frames as an array of data urls
 */
const generateNoiseFrames = (
  height: number,
  width: number,
  numberOfFrames: number
): string[] => {
  // Define result array
  let frames: string[] = [];

  // Initiate a canvas
  const canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;
  const ctx = canvas.getContext('2d');

  // Declare brightness variable (used in the for loop)
  let brightness: number;

  // Generate all frames
  for (let f = 0; f < numberOfFrames; f++) {
    // Fill each pixel with a randomly generated greyscale color
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // Generate and set fill color for this pixel
        brightness = Math.floor(Math.random() * 255);
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        // Fill this pixel
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Add frame to result array
    frames.push(canvas.toDataURL());
  }

  // Return the result array
  return frames;
};

export { generateNoise, generateNoiseFrames };
