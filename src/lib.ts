/*
 * typescript-library-template
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This is the entrypoint to the library.
 */

import GaborStimulusPlugin, { pregenerateGabor } from './GaborStimulusPlugin';
import { ProvidedConfig as GaborPluginConfig } from './PluginConfigParser';
import { GaborConfig as GaborStimulusConfig } from './GaborConfigParser';

export { generateFixationCrossTrial } from './FixationCross';
export { GaborPluginConfig, GaborStimulusConfig, pregenerateGabor };

export default GaborStimulusPlugin;
