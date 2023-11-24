import {z} from 'zod';
import ConfigDef from './configuration/config-definition.js';

/**
 * This class defines the configuration for the core
 * part of the command line interface application.
 */
export default class CoreConfigDef extends ConfigDef {
  name = 'core';
  schema = z.object({
    debug: z
      .boolean()
      .optional()
      .default(false)
      .describe('Toggles the debug mode.'),
    name: z
      .string()
      .optional()
      .default('spdl')
      .describe('The name of the cli application.'),
  });
}
