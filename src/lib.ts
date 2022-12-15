/*
 * typescript-library-template
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This is the entrypoint to the library.
 */

import GaborStimulusPlugin, { pregenerateGabor } from './GaborStimulusPlugin';
import { ProvidedConfig as GaborStimulusPluginConfig } from './ConfigParser';

export { generateFixationCross } from './fixcross';
export { GaborStimulusPluginConfig };

export {
  createGaborPluginProvider,
  GaborConfig as GaborPluginProviderConfig,
} from './provider/provider';

export { pregenerateGabor };

export default GaborStimulusPlugin;
