/*
 * typescript-library-template
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This is the entrypoint to the library.
 */

import GaborStimulusPlugin from './GaborStimulusPlugin';
import { ProvidedConfig as GaborStimulusPluginConfig } from './ConfigParser';

export { generateNoise, generateNoiseFrames } from './NoiseGen';
export { generateFixationCross } from './FixationCrossGen';
export { GaborStimulusPluginConfig };
export default GaborStimulusPlugin;
